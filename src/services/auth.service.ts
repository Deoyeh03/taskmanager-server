import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { RegisterInput, LoginInput } from '../dtos/auth.dto';
import { AppError } from '../utils/AppError';
import { IUser } from '../models/User';

export class AuthService {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    async register(input: RegisterInput): Promise<{ user: IUser; token: string }> {
        const existingUser = await this.userRepo.findByEmail(input.email);
        if (existingUser) {
            throw new AppError('Email already in use', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(input.password, salt);

        const user = await this.userRepo.create({
            username: input.username,
            email: input.email,
            passwordHash,
        });

        const token = this.generateToken(user.id);
        return { user, token };
    }

    async login(input: LoginInput): Promise<{ user: IUser; token: string }> {
        const user = await this.userRepo.findByEmail(input.email);
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

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
