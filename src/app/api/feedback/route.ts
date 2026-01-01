import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { sendEmail } from '@/lib/email'

// Email configuration
const FEEDBACK_EMAIL = 'chiragj2019@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    const body = await request.json()
    const { email, type, message } = body

    // Validate required fields
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create email content
    const typeLabels: Record<string, string> = {
      feedback: '💬 General Feedback',
      bug: '🐛 Bug Report',
      feature: '✨ Feature Request',
      question: '❓ Question',
    }

    const subject = `FocusFlow ${typeLabels[type] || 'Feedback'} from ${email}`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #18181b; color: #fafafa; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #27272a; border-radius: 12px; padding: 24px; }
            .header { text-align: center; margin-bottom: 24px; }
            .logo { font-size: 24px; font-weight: bold; color: #a78bfa; }
            .badge { display: inline-block; padding: 4px 12px; background-color: #3f3f46; border-radius: 20px; font-size: 12px; margin-bottom: 16px; }
            .field { margin-bottom: 16px; }
            .label { font-size: 12px; color: #a1a1aa; text-transform: uppercase; margin-bottom: 4px; }
            .value { font-size: 14px; color: #fafafa; }
            .message-box { background-color: #3f3f46; border-radius: 8px; padding: 16px; white-space: pre-wrap; line-height: 1.6; }
            .footer { margin-top: 24px; text-align: center; font-size: 12px; color: #71717a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎯 FocusFlow</div>
              <p style="color: #a1a1aa; margin-top: 8px;">New Feedback Received</p>
            </div>
            
            <div class="badge">${typeLabels[type] || 'Feedback'}</div>
            
            <div class="field">
              <div class="label">From</div>
              <div class="value">${email}</div>
            </div>
            
            ${userId ? `
            <div class="field">
              <div class="label">User ID</div>
              <div class="value" style="font-family: monospace; font-size: 12px;">${userId}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Message</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="field">
              <div class="label">Sent At</div>
              <div class="value">${new Date().toLocaleString('en-US', { 
                dateStyle: 'full', 
                timeStyle: 'short',
                timeZone: 'UTC'
              })} UTC</div>
            </div>
            
            <div class="footer">
              <p>Reply directly to this email to respond to ${email}</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Plain text version
    const textContent = `
FocusFlow - New Feedback Received

Type: ${typeLabels[type] || 'Feedback'}
From: ${email}
${userId ? `User ID: ${userId}` : ''}

Message:
${message}

Sent at: ${new Date().toISOString()}
    `.trim()

    // Send email using centralized email service
    const emailResult = await sendEmail({
      to: FEEDBACK_EMAIL,
      subject,
      html: htmlContent,
      text: textContent,
      tags: [
        { name: 'type', value: 'feedback' },
        { name: 'feedbackType', value: type || 'general' },
      ],
    })

    // Log feedback for backup
    console.log('='.repeat(50))
    console.log('NEW FEEDBACK RECEIVED')
    console.log('='.repeat(50))
    console.log(`Type: ${typeLabels[type] || 'Feedback'}`)
    console.log(`From: ${email}`)
    console.log(`User ID: ${userId || 'Anonymous'}`)
    console.log(`Message: ${message}`)
    console.log(`Time: ${new Date().toISOString()}`)
    console.log(`Email sent: ${emailResult.success}`)
    console.log('='.repeat(50))

    // Always return success (feedback is logged even if email fails)
    return NextResponse.json({ 
      success: true, 
      message: 'Feedback sent successfully',
      emailSent: emailResult.success,
    })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
