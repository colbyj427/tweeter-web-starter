import { UserEntity } from "../Entity/User";

export interface UserDaoInterface {
        put(user: UserEntity): Promise<void>;
        get(user: UserEntity): Promise<UserEntity | null>;
        update(oldUser: UserEntity, newUser: UserEntity): Promise<void>;
        delete(user: UserEntity): Promise<void>;
}