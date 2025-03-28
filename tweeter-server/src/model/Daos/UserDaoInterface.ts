import { UserEntity } from "../Entity/User";

export interface UserDaoInterface {
        put(user: UserEntity): Promise<void>;
        get(user: string): Promise<UserEntity | null>;
        updateCounts(oldUser: UserEntity, followeeCount: number, followerCount: number): Promise<void>;
        delete(user: UserEntity): Promise<void>;
        putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
        getImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
        putSession(token: string, alias: string, timestamp: number): Promise<void>;
        updateSession(token: string, timestamp: number): Promise<void>;
}