import { DataPage } from "../Entity/DataPage";
import { StatusEntity } from "../Entity/StatusEntity";

export interface StatusDaoInterface {
    putInStory(status: StatusEntity): Promise<void>;
    putInFeed(owner_handle: string, status: StatusEntity): Promise<void>;
    get(status: StatusEntity): Promise<StatusEntity | null>;
    update(oldStatus: StatusEntity, newStatus: StatusEntity): Promise<void>;
    delete(status: StatusEntity): Promise<void>;
    // getPageOfStory(userHandle: string, pageSize: number): Promise<DataPage<StatusEntity>>;
    // getPageOfFeed(userHandle: string, pageSize: number): Promise<DataPage<StatusEntity>>;
}