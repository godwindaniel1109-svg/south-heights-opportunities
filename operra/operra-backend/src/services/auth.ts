import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../index'
import { User, AuthPayload, CreateUserRequest, LoginRequest } from '../types'

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  static generateTokens(payload: AuthPayload): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' })
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
    return { accessToken, refreshToken }
  }

  static verifyToken(token: string): AuthPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload
  }

  static async createUser(data: CreateUserRequest & { company_id: string }): Promise<User> {
    const passwordHash = await this.hashPassword(data.password)
    
    const query = `
      INSERT INTO users (company_id, email, password_hash, first_name, last_name, phone, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `
    
    const values = [
      data.company_id,
      data.email,
      passwordHash,
      data.first_name,
      data.last_name,
      data.phone || null,
      data.role || 'staff'
    ]

    const result = await pool.query(query, values)
    return result.rows[0]
  }

  static async findUserByEmail(email: string, company_id?: string): Promise<User | null> {
    let query = 'SELECT * FROM users WHERE email = $1'
    const values = [email]

    if (company_id) {
      query += ' AND company_id = $2'
      values.push(company_id)
    }

    const result = await pool.query(query, values)
    return result.rows[0] || null
  }

  static async findUserById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true'
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }

  static async updateUserLastLogin(userId: string): Promise<void> {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1'
    await pool.query(query, [userId])
  }

  static async validateLogin(data: LoginRequest): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } } | null> {
    const user = await this.findUserByEmail(data.email)
    
    if (!user || !user.is_active) {
      return null
    }

    const isValidPassword = await this.comparePassword(data.password, user.password_hash)
    if (!isValidPassword) {
      return null
    }

    await this.updateUserLastLogin(user.id)

    const payload: AuthPayload = {
      userId: user.id,
      companyId: user.company_id,
      email: user.email,
      role: user.role
    }

    const tokens = this.generateTokens(payload)

    return { user, tokens }
  }
}
