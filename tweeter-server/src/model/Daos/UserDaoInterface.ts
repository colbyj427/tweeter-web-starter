import { User } from "../Entity/User";

export interface UserDaoInterface {
        put(user: User): Promise<void>;
        get(user: User): Promise<User | null>;
        update(oldUser: User, newUser: User): Promise<void>;
        delete(user: User): Promise<void>;
}