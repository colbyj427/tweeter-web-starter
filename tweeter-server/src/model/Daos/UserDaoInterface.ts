import { UserEntity } from "../Entity/User";

export interface UserDaoInterface {
        put(user: UserEntity): Promise<void>;
        get(user: string): Promise<UserEntity | null>;
        getFollowerCount(user: string): Promise<number | null>;
        getFolloweeCount(user: string): Promise<number | null>;
        updateCounts(oldUser: string, followeeCount: number, followerCount: number): Promise<void>;
        delete(user: UserEntity): Promise<void>;
        putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
        getImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
        putSession(token: string, alias: string, timestamp: number): Promise<void>;
        getSession(token: string): Promise<boolean>;
        getAliasFromSession(token: string): Promise<string | null>;
        updateSession(token: string, timestamp: number): Promise<void>;
}