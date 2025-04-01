import { DataPage } from "../Entity/DataPage";
import { Follower } from "../Entity/Follower";

export interface FollowerDao {
    put(user: Follower): Promise<void>;
    get(user: Follower): Promise<Follower | null>;
    update(oldUser: Follower, newUser: Follower): Promise<void>;
    delete(user: Follower): Promise<void>;
    getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<Follower>>;
    getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<Follower>>;
}
