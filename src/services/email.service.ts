import nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        const hasCredentials = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

        if (hasCredentials) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }
    }

    async sendVerificationEmail(email: string, token: string): Promise<void> {
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;
        const subject = 'Verify your email address';
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4f46e5;">Welcome to TaskFlow!</h2>
                <p>Thank you for signing up. Please verify your email address to get started.</p>
                <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email</a>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">Link: ${verificationUrl}</p>
            </div>
        `;

        await this.sendEmail(email, subject, html);
    }

    async sendPasswordResetEmail(email: string, token: string): Promise<void> {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
        const subject = 'Reset your password';
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4f46e5;">Password Reset Request</h2>
                <p>You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">Link: ${resetUrl}</p>
            </div>
        `;

        await this.sendEmail(email, subject, html);
    }

    private async sendEmail(to: string, subject: string, html: string): Promise<void> {
        if (!this.transporter) {
            console.log('\n--- DUMMY EMAIL LOG ---');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`HTML: ${html.substring(0, 100)}... (truncated)`);
            console.log('--- END LOG --- \n');
            return;
        }

        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"TaskFlow" <noreply@taskflow.com>',
                to,
                subject,
                html,
            });
        } catch (error) {
            console.error('Error sending email:', error);
            // Don't throw for emails in dev/demo usually, but in prod we might want to
            if (process.env.NODE_ENV === 'production') throw error;
        }
    }
}
