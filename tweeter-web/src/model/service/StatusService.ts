import { AuthToken, FakeData, PagedStatusItemRequest, PostStatusRequest, Status } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
    facade = new ServerFacade;

    public async loadMoreStoryItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        const req: PagedStatusItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem ? lastItem.dto : null
        };

        return this.facade.getMoreStories(req)
        //return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
      };
    
      public async loadMoreFeedItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server

        return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
      };

      public async postStatus (
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server to post the status
        const req: PostStatusRequest = {
          token: authToken.token,
          userAlias: newStatus.user.alias,
          status: newStatus.dto
        };
        this.facade.postStatus(req);
      };
}