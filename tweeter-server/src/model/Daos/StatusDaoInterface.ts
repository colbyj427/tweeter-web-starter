import { DataPage } from "../Entity/DataPage";
import { StatusEntity } from "../Entity/StatusEntity";

export interface StatusDaoInterface {
    putInStory(status: StatusEntity): Promise<void>;
    putInFeed(owner_handle: string, status: StatusEntity): Promise<void>;
    getStoryItem(status: StatusEntity): Promise<StatusEntity | null>;
    getPageOfStory(userHandle: string, pageSize: number, lastStoryStamp: number | undefined): Promise<DataPage<StatusEntity>>;
    getPageOfFeed(userHandle: string, pageSize: number, lastStoryStamp: number | undefined): Promise<DataPage<StatusEntity>>;
}