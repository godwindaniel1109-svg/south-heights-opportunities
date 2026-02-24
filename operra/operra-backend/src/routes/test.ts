import { FastifyInstance } from 'fastify'
import { pool } from '../index'

export async function testRoutes(fastify: FastifyInstance) {
  // Test database connection
  fastify.get('/db', async (request, reply) => {
    try {
      const result = await pool.query('SELECT NOW() as current_time, version() as version')
      return {
        success: true,
        data: {
          database_time: result.rows[0].current_time,
          postgres_version: result.rows[0].version
        }
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Test schema existence
  fastify.get('/schema', async (request, reply) => {
    try {
      const tables = [
        'companies', 'users', 'customers', 'products', 
        'invoices', 'invoice_items', 'payments', 'expenses', 
        'tasks', 'activity_logs'
      ]

      const results = []
      for (const table of tables) {
        const result = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = '${table}'
          ) as exists
        `)
        results.push({ table, exists: result.rows[0].exists })
      }

      return {
        success: true,
        data: {
          tables: results,
          all_exist: results.every(r => r.exists)
        }
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Schema check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Test company isolation
  fastify.get('/isolation', async (request, reply) => {
    try {
      // Test that queries without company_id return no data
      const usersWithoutCompany = await pool.query(
        'SELECT COUNT(*) as count FROM users WHERE company_id IS NULL'
      )
      
      const customersWithoutCompany = await pool.query(
        'SELECT COUNT(*) as count FROM customers WHERE company_id IS NULL'
      )

      return {
        success: true,
        data: {
          users_without_company: parseInt(usersWithoutCompany.rows[0].count),
          customers_without_company: parseInt(customersWithoutCompany.rows[0].count),
          isolation_working: 
            parseInt(usersWithoutCompany.rows[0].count) === 0 && 
            parseInt(customersWithoutCompany.rows[0].count) === 0
        }
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Isolation test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Test JWT functionality
  fastify.get('/jwt', async (request, reply) => {
    try {
      const testPayload = {
        userId: 'test-user-id',
        companyId: 'test-company-id',
        email: 'test@example.com',
        role: 'admin'
      }

      const token = fastify.jwt.sign(testPayload)
      
      // Verify the token
      const decoded = fastify.jwt.verify(token) as any

      return {
        success: true,
        data: {
          token_generated: true,
          token_verified: true,
          payload_matches: 
            decoded.userId === testPayload.userId &&
            decoded.companyId === testPayload.companyId &&
            decoded.email === testPayload.email &&
            decoded.role === testPayload.role
        }
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'JWT test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })
}
