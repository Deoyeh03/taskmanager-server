import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRepository } from '../repositories/user.repository';
import { RegisterInput, LoginInput } from '../dtos/auth.dto';
import { AppError } from '../utils/AppError';
import { IUser } from '../models/User';
import { EmailService } from './email.service';

export class AuthService {
    private userRepo: UserRepository;
    private emailService: EmailService;

    constructor() {
        this.userRepo = new UserRepository();
        this.emailService = new EmailService();
    }

    async register(input: RegisterInput): Promise<{ user: IUser; token: string }> {
        const existingUser = await this.userRepo.findByEmail(input.email);
        if (existingUser) {
            throw new AppError('Email already in use', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(input.password, salt);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await this.userRepo.create({
            username: input.username,
            email: input.email,
            passwordHash,
            verificationToken,
            isVerified: false,
        });

        // Send verification email
        await this.emailService.sendVerificationEmail(user.email, verificationToken);

        const token = this.generateToken(user.id);
        return { user, token };
    }

    async verifyEmail(token: string): Promise<void> {
        const user = await this.userRepo.findByVerificationToken(token);
        if (!user) {
            throw new AppError('Invalid or expired verification token', 400);
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            // Don't reveal user existence for security, but we'll just return success
            return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    }

    async resetPassword(token: string, password: string): Promise<void> {
        const user = await this.userRepo.findByResetToken(token);
        if (!user) {
            throw new AppError('Invalid or expired reset token', 400);
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    }

    async login(input: LoginInput): Promise<{ user: IUser; token: string }> {
        const user = await this.userRepo.findByEmail(input.email);
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Optional: Check if verified before login if requested
        // if (!user.isVerified) {
        //     throw new AppError('Please verify your email before logging in', 401);
        // }

        const isMatch = await bcrypt.compare(input.password, user.passwordHash);
        if (!isMatch) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = this.generateToken(user.id);
        return { user, token };
    }

    private generateToken(userId: string): string {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d',
        });
    }
}
