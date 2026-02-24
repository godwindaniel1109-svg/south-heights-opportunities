import { FastifyInstance } from 'fastify'
import { AuthService } from '../services/auth'
import { CreateUserRequest, LoginRequest } from '../types'
import { pool } from '../index'

export async function authRoutes(fastify: FastifyInstance) {
  // Register new company and admin user
  fastify.post('/register', async (request, reply) => {
    try {
      const { company, user } = request.body as {
        company: { name: string; email: string; phone?: string; currency?: string }
        user: CreateUserRequest
      }

      // Create company
      const companyQuery = `
        INSERT INTO companies (name, email, phone, currency)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `
      const companyValues = [
        company.name,
        company.email,
        company.phone || null,
        company.currency || 'NGN'
      ]
      
      const companyResult = await pool.query(companyQuery, companyValues)
      const newCompany = companyResult.rows[0]

      // Create admin user for the company
      const adminUser = await AuthService.createUser({
        ...user,
        company_id: newCompany.id,
        role: 'admin'
      })

      // Generate tokens
      const payload = {
        userId: adminUser.id,
        companyId: newCompany.id,
        email: adminUser.email,
        role: adminUser.role
      }

      const tokens = AuthService.generateTokens(payload)

      // Set refresh token in HTTP-only cookie
      reply.setCookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      return {
        success: true,
        data: {
          user: {
            id: adminUser.id,
            email: adminUser.email,
            first_name: adminUser.first_name,
            last_name: adminUser.last_name,
            role: adminUser.role
          },
          company: {
            id: newCompany.id,
            name: newCompany.name,
            email: newCompany.email,
            currency: newCompany.currency
          },
          tokens: {
            accessToken: tokens.accessToken
          }
        }
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(400)
      return {
        success: false,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Login existing user
  fastify.post('/login', async (request, reply) => {
    try {
      const loginData = request.body as LoginRequest

      const result = await AuthService.validateLogin(loginData)
      
      if (!result) {
        reply.code(401)
        return {
          success: false,
          message: 'Invalid email or password'
        }
      }

      // Set refresh token in HTTP-only cookie
      reply.setCookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      return {
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            first_name: result.user.first_name,
            last_name: result.user.last_name,
            role: result.user.role
          },
          tokens: {
            accessToken: result.tokens.accessToken
          }
        }
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  // Refresh access token
  fastify.post('/refresh', async (request, reply) => {
    try {
      const refreshToken = request.cookies.refreshToken
      
      if (!refreshToken) {
        reply.code(401)
        return {
          success: false,
          message: 'No refresh token provided'
        }
      }

      const payload = AuthService.verifyToken(refreshToken)
      
      // Verify user still exists and is active
      const user = await AuthService.findUserById(payload.userId)
      if (!user || !user.is_active) {
        reply.code(401)
        return {
          success: false,
          message: 'User not found or inactive'
        }
      }

      // Generate new tokens
      const newTokens = AuthService.generateTokens(payload)

      // Update refresh token cookie
      reply.setCookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      return {
        success: true,
        data: {
          tokens: {
            accessToken: newTokens.accessToken
          }
        }
      }
    } catch (error) {
      fastify.log.error(error)
      reply.code(401)
      return {
        success: false,
        message: 'Invalid refresh token'
      }
    }
  })

  // Logout
  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('refreshToken')
    return {
      success: true,
      message: 'Logged out successfully'
    }
  })
}
