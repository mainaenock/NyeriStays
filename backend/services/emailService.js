const nodemailer = require('nodemailer');
const config = require('../config/env');

// Create transporter
const createTransporter = () => {
  const emailFrom = config.EMAIL_FROM;
  const emailPassword = config.EMAIL_PASSWORD;
  
  // Log email configuration for debugging (remove in production)
  console.log('Email configuration:', {
    from: emailFrom,
    hasPassword: !!emailPassword,
    passwordLength: emailPassword ? emailPassword.length : 0,
    config: {
      EMAIL_FROM: config.EMAIL_FROM,
      EMAIL_PASSWORD: config.EMAIL_PASSWORD ? 'SET' : 'NOT SET'
    }
  });
  
  if (!emailPassword) {
    throw new Error('EMAIL_PASSWORD environment variable is required');
  }
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailFrom,
        pass: emailPassword
      }
    });
    
    console.log('Transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('Failed to create transporter:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  passwordReset: (resetUrl, userName) => ({
    subject: 'Reset your Nyeri Stays password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Nyeri Stays</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your Nyeri Stays account.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This link will expire in 10 minutes for security reasons.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 12px;">
            © 2024 Nyeri Stays. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  emailVerification: (verificationUrl, userName) => ({
    subject: 'Verify your Nyeri Stays email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Nyeri Stays</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to Nyeri Stays, ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for creating an account with Nyeri Stays. To complete your registration, please verify your email address.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Verify Email
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Once verified, you'll be able to access all features of Nyeri Stays and start exploring amazing accommodations in Nyeri.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 12px;">
            © 2024 Nyeri Stays. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  welcomeEmail: (userName) => ({
    subject: 'Welcome to Nyeri Stays!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Nyeri Stays</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to Nyeri Stays, ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining Nyeri Stays! We're excited to help you discover amazing accommodations in Nyeri and surrounding areas.
          </p>
          
          <div style="background: #fff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">What you can do now:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Browse our collection of unique properties</li>
              <li>Book your perfect stay in Nyeri</li>
              <li>Connect with local hosts</li>
              <li>Experience authentic Kenyan hospitality</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Start Exploring
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you have any questions or need assistance, feel free to contact our support team.
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 12px;">
            © 2024 Nyeri Stays. All rights reserved.
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data = {}) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = emailTemplates[template](data.url, data.userName);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'campusroomske@gmail.com',
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

// Specific email functions
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${config.FRONTEND_URL}/reset-password/${resetToken}`;
  return await sendEmail(email, 'passwordReset', { url: resetUrl, userName });
};

const sendEmailVerification = async (email, verificationToken, userName) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  return await sendEmail(email, 'emailVerification', { url: verificationUrl, userName });
};

const sendWelcomeEmail = async (email, userName) => {
  return await sendEmail(email, 'welcomeEmail', { userName });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendWelcomeEmail
}; 