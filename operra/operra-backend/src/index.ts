import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const server = Fastify({
  logger: true
})

// Database connection
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Register plugins
server.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
})

server.register(jwt, {
  secret: process.env.JWT_SECRET || 'default-secret',
  cookie: {
    cookieName: 'token',
    signed: false
  }
})

server.register(cookie)

// Health check
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Auth routes
server.register(async function (server) {
  server.post('/register', async (request, reply) => {
    // TODO: Implement user registration
    return { message: 'Registration endpoint' }
  })

  server.post('/login', async (request, reply) => {
    // TODO: Implement user login
    return { message: 'Login endpoint' }
  })
}, { prefix: '/auth' })

// Import and register auth routes
import { authRoutes } from './routes/auth'
server.register(authRoutes, { prefix: '/auth' })

// Import and register test routes
import { testRoutes } from './routes/test'
server.register(testRoutes, { prefix: '/test' })

// Import and register customer routes
import { customerRoutes } from './routes/customers'
server.register(customerRoutes, { prefix: '/api/customers' })

// Import and register invoice routes
import { invoiceRoutes } from './routes/invoices'
server.register(invoiceRoutes, { prefix: '/api/invoices' })

// Protected routes example
server.register(async function (server) {
  server.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  server.get('/profile', async (request) => {
    // TODO: Get user profile
    return { message: 'Protected route' }
  })
}, { prefix: '/api' })

const start = async () => {
  try {
    await server.listen({ port: parseInt(process.env.PORT || '3000') })
    console.log('🚀 Operra Backend Server running!')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
