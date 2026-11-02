import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000
const MESSAGES_FILE = path.join(__dirname, 'data', 'messages.json')

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}))
app.use(express.json())

// Helper to save message locally
function saveMessageLocally(messageData) {
  try {
    let messages = []
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8')
      messages = JSON.parse(raw || '[]')
    }
    messages.push({
      id: Date.now().toString(),
      ...messageData,
      createdAt: new Date().toISOString()
    })
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8')
  } catch (err) {
    console.error('[Storage Error] Failed to save message locally:', err.message)
  }
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Clarence Millares Portfolio API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// Contact Form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body

    // Simple validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: name, email, message.'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      })
    }

    console.log(`[Contact Form] Incoming message from: ${name} <${email}>`)

    // 1. Save to local database / archive
    saveMessageLocally({ name, email, message })

    // 2. Forward to Web3Forms to deliver directly to Gmail
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY
    if (accessKey) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: accessKey,
            name,
            email,
            message,
            subject: `Portfolio Message from ${name}`,
            from_name: 'Portfolio Contact'
          })
        })

        const data = await response.json()
        if (!data.success) {
          console.warn('[Web3Forms Warning]', data.message)
        }
      } catch (emailErr) {
        console.error('[Web3Forms Error] Failed to forward email:', emailErr.message)
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!'
    })
  } catch (error) {
    console.error('[Server Error]', error)
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred. Please try again later.'
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`===============================================`)
  console.log(`🚀 Portfolio Backend running on http://localhost:${PORT}`)
  console.log(`📬 Contact endpoint: http://localhost:${PORT}/api/contact`)
  console.log(`===============================================`)
})

