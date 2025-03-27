import { DataPage } from "../Entity/DataPage";
import { Follower } from "../Entity/Follower";

export interface FollowerDao {
    // readonly tableName: string;
    // readonly indexName: string;
    // readonly follower_handleAttr: string;
    // readonly followee_handleAttr: string;
    // readonly follower_nameAttr: string;
    // readonly followee_nameAttr: string;

    put(user: Follower): Promise<void>;
    get(user: Follower): Promise<Follower | null>;
    update(oldUser: Follower, newUser: Follower): Promise<void>;
    delete(user: Follower): Promise<void>;
    getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<Follower>>;
    getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<Follower>>;
}
