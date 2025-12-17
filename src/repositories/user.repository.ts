import User, { IUser } from '../models/User';

export class UserRepository {
    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }

    async create(data: Partial<IUser>): Promise<IUser> {
        return User.create(data);
    }

    async findById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }
}
