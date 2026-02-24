import { FastifyInstance } from 'fastify'
import { pool } from '../index'

export async function customerRoutes(fastify: FastifyInstance) {
  // Get all customers for a company
  fastify.get('/', async (request, reply) => {
    try {
      const { companyId } = (request as any).user
      
      const query = `
        SELECT id, name, email, phone, address, notes, outstanding_balance, total_purchases, is_vip, created_at, updated_at
        FROM customers 
        WHERE company_id = $1 
        ORDER BY created_at DESC
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
        message: 'Failed to fetch customers',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Get single customer
  fastify.get('/:id', async (request, reply) => {
    try {
      const { companyId } = (request as any).user
      const { id } = request.params as { id: string }
      
      const query = `
        SELECT id, name, email, phone, address, notes, outstanding_balance, total_purchases, is_vip, created_at, updated_at
        FROM customers 
        WHERE company_id = $1 AND id = $2
      `
      
      const result = await pool.query(query, [companyId, id])
      
      if (result.rows.length === 0) {
        reply.code(404)
        return {
          success: false,
          message: 'Customer not found'
        }
      }
      
      return {
        success: true,
        data: result.rows[0]
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Failed to fetch customer',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Create new customer
  fastify.post('/', async (request, reply) => {
    try {
      const { companyId } = (request as any).user
      const { name, email, phone, address, notes } = request.body as {
        name: string
        email?: string
        phone?: string
        address?: string
        notes?: string
      }
      
      const query = `
        INSERT INTO customers (company_id, name, email, phone, address, notes, outstanding_balance, total_purchases, is_vip)
        VALUES ($1, $2, $3, $4, $5, $6, 0, 0, false)
        RETURNING id, name, email, phone, address, notes, outstanding_balance, total_purchases, is_vip, created_at, updated_at
      `
      
      const values = [
        companyId,
        name,
        email || null,
        phone || null,
        address || null,
        notes || null
      ]
      
      const result = await pool.query(query, values)
      
      // Log activity
      await pool.query(`
        INSERT INTO activity_logs (company_id, user_id, action, entity_type, entity_id, new_values)
        VALUES ($1, $2, 'created', 'customer', $3, $4)
      `, [
        companyId,
        (request as any).user.userId,
        result.rows[0].id,
        JSON.stringify({ name, email, phone })
      ])
      
      reply.code(201)
      return {
        success: true,
        data: result.rows[0]
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Failed to create customer',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Update customer
  fastify.put('/:id', async (request, reply) => {
    try {
      const { companyId, userId } = (request as any).user
      const { id } = request.params as { id: string }
      const { name, email, phone, address, notes, is_vip } = request.body as {
        name?: string
        email?: string
        phone?: string
        address?: string
        notes?: string
        is_vip?: boolean
      }
      
      // Get current customer data for activity log
      const currentResult = await pool.query(
        'SELECT * FROM customers WHERE company_id = $1 AND id = $2',
        [companyId, id]
      )
      
      if (currentResult.rows.length === 0) {
        reply.code(404)
        return {
          success: false,
          message: 'Customer not found'
        }
      }
      
      const currentCustomer = currentResult.rows[0]
      
      // Build dynamic update query
      const updateFields = []
      const values = []
      let paramIndex = 1
      
      if (name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`)
        values.push(name)
      }
      if (email !== undefined) {
        updateFields.push(`email = $${paramIndex++}`)
        values.push(email)
      }
      if (phone !== undefined) {
        updateFields.push(`phone = $${paramIndex++}`)
        values.push(phone)
      }
      if (address !== undefined) {
        updateFields.push(`address = $${paramIndex++}`)
        values.push(address)
      }
      if (notes !== undefined) {
        updateFields.push(`notes = $${paramIndex++}`)
        values.push(notes)
      }
      if (is_vip !== undefined) {
        updateFields.push(`is_vip = $${paramIndex++}`)
        values.push(is_vip)
      }
      
      if (updateFields.length === 0) {
        return {
          success: false,
          message: 'No fields to update'
        }
      }
      
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
      values.push(companyId, id)
      
      const query = `
        UPDATE customers 
        SET ${updateFields.join(', ')}
        WHERE company_id = $${paramIndex++} AND id = $${paramIndex++}
        RETURNING id, name, email, phone, address, notes, outstanding_balance, total_purchases, is_vip, created_at, updated_at
      `
      
      const result = await pool.query(query, values)
      
      // Log activity
      await pool.query(`
        INSERT INTO activity_logs (company_id, user_id, action, entity_type, entity_id, old_values, new_values)
        VALUES ($1, $2, 'updated', 'customer', $3, $4, $5)
      `, [
        companyId,
        userId,
        id,
        JSON.stringify({
          name: currentCustomer.name,
          email: currentCustomer.email,
          phone: currentCustomer.phone
        }),
        JSON.stringify({ name, email, phone })
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
        message: 'Failed to update customer',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Delete customer
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { companyId, userId } = (request as any).user
      const { id } = request.params as { id: string }
      
      // Get customer data before deletion for activity log
      const customerResult = await pool.query(
        'SELECT * FROM customers WHERE company_id = $1 AND id = $2',
        [companyId, id]
      )
      
      if (customerResult.rows.length === 0) {
        reply.code(404)
        return {
          success: false,
          message: 'Customer not found'
        }
      }
      
      const customer = customerResult.rows[0]
      
      // Check if customer has invoices or payments
      const invoiceCheck = await pool.query(
        'SELECT COUNT(*) as count FROM invoices WHERE company_id = $1 AND customer_id = $2',
        [companyId, id]
      )
      
      if (parseInt(invoiceCheck.rows[0].count) > 0) {
        reply.code(400)
        return {
          success: false,
          message: 'Cannot delete customer with existing invoices'
        }
      }
      
      await pool.query(
        'DELETE FROM customers WHERE company_id = $1 AND id = $2',
        [companyId, id]
      )
      
      // Log activity
      await pool.query(`
        INSERT INTO activity_logs (company_id, user_id, action, entity_type, entity_id, old_values)
        VALUES ($1, $2, 'deleted', 'customer', $3, $4)
      `, [
        companyId,
        userId,
        id,
        JSON.stringify({
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        })
      ])
      
      return {
        success: true,
        message: 'Customer deleted successfully'
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Failed to delete customer',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })
}
