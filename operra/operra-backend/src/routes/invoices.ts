import { FastifyInstance } from 'fastify'
import { pool } from '../index'

export async function invoiceRoutes(fastify: FastifyInstance) {
  // Get all invoices for a company
  fastify.get('/', async (request, reply) => {
    try {
      const { companyId } = (request as any).user
      
      const query = `
        SELECT i.*, c.name as customer_name, c.email as customer_email
        FROM invoices i
        LEFT JOIN customers c ON i.customer_id = c.id
        WHERE i.company_id = $1 
        ORDER BY i.issue_date DESC, i.created_at DESC
      `
      
      const result = await pool.query(query, [companyId])
      
      return {
        success: true,
        data: result.rows
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Failed to fetch invoices',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Get single invoice with items
  fastify.get('/:id', async (request, reply) => {
    try {
      const { companyId } = (request as any).user
      const { id } = request.params as { id: string }
      
      // Get invoice details
      const invoiceQuery = `
        SELECT i.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.address as customer_address
        FROM invoices i
        LEFT JOIN customers c ON i.customer_id = c.id
        WHERE i.company_id = $1 AND i.id = $2
      `
      
      const invoiceResult = await pool.query(invoiceQuery, [companyId, id])
      
      if (invoiceResult.rows.length === 0) {
        reply.code(404)
        return {
          success: false,
          message: 'Invoice not found'
        }
      }
      
      // Get invoice items
      const itemsQuery = `
        SELECT ii.*, p.name as product_name
        FROM invoice_items ii
        LEFT JOIN products p ON ii.product_id = p.id
        WHERE ii.invoice_id = $1
        ORDER BY ii.created_at
      `
      
      const itemsResult = await pool.query(itemsQuery, [id])
      
      return {
        success: true,
        data: {
          ...invoiceResult.rows[0],
          items: itemsResult.rows
        }
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Failed to fetch invoice',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Create new invoice
  fastify.post('/', async (request, reply) => {
    try {
      const { companyId, userId } = (request as any).user
      const { 
        customer_id, 
        issue_date, 
        due_date, 
        items,
        notes,
        tax_percentage = 0
      } = request.body as {
        customer_id?: string
        issue_date: string
        due_date?: string
        items: Array<{
          description: string
          quantity: number
          unit_price: number
          product_id?: string
        }>
        notes?: string
        tax_percentage?: number
      }
      
      // Start transaction
      const client = await pool.connect()
      
      try {
        await client.query('BEGIN')
        
        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
        const tax_amount = subtotal * (tax_percentage / 100)
        const total_amount = subtotal + tax_amount
        
        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}`
        
        // Create invoice
        const invoiceQuery = `
          INSERT INTO invoices (company_id, customer_id, invoice_number, issue_date, due_date, status, subtotal, tax_amount, tax_percentage, total_amount, paid_amount, notes, created_by)
          VALUES ($1, $2, $3, $4, $5, 'sent', $6, $7, $8, $9, 0, $10, $11)
          RETURNING *
        `
        
        const invoiceValues = [
          companyId,
          customer_id || null,
          invoiceNumber,
          issue_date,
          due_date || null,
          subtotal,
          tax_amount,
          tax_percentage,
          total_amount,
          notes || null,
          userId
        ]
        
        const invoiceResult = await client.query(invoiceQuery, invoiceValues)
        const invoice = invoiceResult.rows[0]
        
        // Create invoice items
        for (const item of items) {
          const itemQuery = `
            INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price)
            VALUES ($1, $2, $3, $4, $5)
          `
          
          await client.query(itemQuery, [
            invoice.id,
            item.product_id || null,
            item.description,
            item.quantity,
            item.unit_price
          ])
        }
        
        // Update customer total purchases if customer exists
        if (customer_id) {
          await client.query(`
            UPDATE customers 
            SET total_purchases = total_purchases + $1, outstanding_balance = outstanding_balance + $1
            WHERE id = $2
          `, [total_amount, customer_id])
        }
        
        // Log activity
        await client.query(`
          INSERT INTO activity_logs (company_id, user_id, action, entity_type, entity_id, new_values)
          VALUES ($1, $2, 'created', 'invoice', $3, $4)
        `, [
          companyId,
          userId,
          invoice.id,
          JSON.stringify({ invoice_number: invoiceNumber, total_amount, customer_id })
        ])
        
        await client.query('COMMIT')
        
        reply.code(201)
        return {
          success: true,
          data: {
            ...invoice,
            items
          }
        }
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Failed to create invoice',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Update invoice status
  fastify.put('/:id/status', async (request, reply) => {
    try {
      const { companyId, userId } = (request as any).user
      const { id } = request.params as { id: string }
      const { status } = request.body as { status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' }
      
      // Get current invoice
      const currentResult = await pool.query(
        'SELECT * FROM invoices WHERE company_id = $1 AND id = $2',
        [companyId, id]
      )
      
      if (currentResult.rows.length === 0) {
        reply.code(404)
        return {
          success: false,
          message: 'Invoice not found'
        }
      }
      
      const currentInvoice = currentResult.rows[0]
      
      const query = `
        UPDATE invoices 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE company_id = $2 AND id = $3
        RETURNING *
      `
      
      const result = await pool.query(query, [status, companyId, id])
      
      // Log activity
      await pool.query(`
        INSERT INTO activity_logs (company_id, user_id, action, entity_type, entity_id, old_values, new_values)
        VALUES ($1, $2, 'updated', 'invoice', $3, $4, $5)
      `, [
        companyId,
        userId,
        id,
        JSON.stringify({ status: currentInvoice.status }),
        JSON.stringify({ status })
      ])
      
      return {
        success: true,
        data: result.rows[0]
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Failed to update invoice status',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Delete invoice
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { companyId, userId } = (request as any).user
      const { id } = request.params as { id: string }
      
      // Get invoice details before deletion
      const invoiceResult = await pool.query(
        'SELECT * FROM invoices WHERE company_id = $1 AND id = $2',
        [companyId, id]
      )
      
      if (invoiceResult.rows.length === 0) {
        reply.code(404)
        return {
          success: false,
          message: 'Invoice not found'
        }
      }
      
      const invoice = invoiceResult.rows[0]
      
      // Check if invoice has payments
      const paymentCheck = await pool.query(
        'SELECT COUNT(*) as count FROM payments WHERE company_id = $1 AND invoice_id = $2',
        [companyId, id]
      )
      
      if (parseInt(paymentCheck.rows[0].count) > 0) {
        reply.code(400)
        return {
          success: false,
          message: 'Cannot delete invoice with existing payments'
        }
      }
      
      // Start transaction
      const client = await pool.connect()
      
      try {
        await client.query('BEGIN')
        
        // Update customer balances if customer exists
        if (invoice.customer_id) {
          await client.query(`
            UPDATE customers 
            SET total_purchases = total_purchases - $1, outstanding_balance = outstanding_balance - $1
            WHERE id = $2
          `, [invoice.total_amount, invoice.customer_id])
        }
        
        // Delete invoice items first (foreign key constraint)
        await client.query('DELETE FROM invoice_items WHERE invoice_id = $1', [id])
        
        // Delete invoice
        await client.query('DELETE FROM invoices WHERE company_id = $1 AND id = $2', [companyId, id])
        
        // Log activity
        await client.query(`
          INSERT INTO activity_logs (company_id, user_id, action, entity_type, entity_id, old_values)
          VALUES ($1, $2, 'deleted', 'invoice', $3, $4)
        `, [
          companyId,
          userId,
          id,
          JSON.stringify({ 
            invoice_number: invoice.invoice_number, 
            total_amount: invoice.total_amount 
          })
        ])
        
        await client.query('COMMIT')
        
        return {
          success: true,
          message: 'Invoice deleted successfully'
        }
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Failed to delete invoice',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })
}
