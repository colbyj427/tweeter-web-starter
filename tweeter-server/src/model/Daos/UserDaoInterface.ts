import { UserEntity } from "../Entity/User";

export interface UserDaoInterface {
        put(user: UserEntity): Promise<void>;
        get(user: string): Promise<UserEntity | null>;
        update(oldUser: UserEntity, newUser: UserEntity): Promise<void>;
        delete(user: UserEntity): Promise<void>;
        putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
        getImage(fileName: string, imageStringBase64Encoded: string): Promise<string>
}