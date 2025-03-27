import { FakeData, Status, StatusDto } from "tweeter-shared";
import { StatusDaoInterface } from "../Daos/StatusDaoInterface";
import { StatusEntity } from "../Entity/StatusEntity";

export class StatusService {
  private dao: StatusDaoInterface;
  
  constructor(dao: StatusDaoInterface) {
    this.dao = dao;
  }

    public async loadMoreStoryItems (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias)
        //return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
      };
    
      public async loadMoreFeedItems (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias)
        //return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
      };

      private async getFakeData(lastItem: StatusDto | null, pageSize: number, userAlias: string): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
      }

      public async postStatus (
        token: string,
        newStatus: StatusDto
      ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        const statusEntity = new StatusEntity(
          newStatus.user.alias,
          newStatus.post,
          newStatus.timestamp
        )
        // TODO: Call the server to post the status
        this.dao.putInStory(statusEntity)

        //Next we need to get all the users following this user, and add the story to each of their feeds.
      };
}