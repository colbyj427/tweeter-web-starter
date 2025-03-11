import {
    GetCountRequest,
    GetCountResponse,
    IsFollowerRequest,
    IsFollowerResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
    User,
    UserDto,
  } from "tweeter-shared";
  import { ClientCommunicator } from "./ClientCommunicator";
  
  export class ServerFacade {
    private SERVER_URL = "https://877ck2ig9a.execute-api.us-west-1.amazonaws.com/dev";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  
    public async getMoreFollowees(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedUserItemRequest,
        PagedUserItemResponse
      >(request, "/followee/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No followees found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }

    public async getMoreFollowers(
        request: PagedUserItemRequest
      ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
          PagedUserItemRequest,
          PagedUserItemResponse
        >(request, "/follower/list");
    
        // Convert the UserDto array returned by ClientCommunicator to a User array
        const items: User[] | null =
          response.success && response.items
            ? response.items.map((dto) => User.fromDto(dto) as User)
            : null;
    
        // Handle errors    
        if (response.success) {
          if (items == null) {
            throw new Error(`No followees found`);
          } else {
            return [items, response.hasMore];
          }
        } else {
          console.error(response);
          throw new Error(response.message ?? undefined);
        }
      }

      public async getIsFollower(
        request: IsFollowerRequest
      ): Promise<boolean> {
        const response = await this.clientCommunicator.doPost<
          IsFollowerRequest,
          IsFollowerResponse
        >(request, "/isFollower");
    
        // Convert the UserDto array returned by ClientCommunicator to a User array
        const isFollower: boolean | null = response.success ? response.isFollower : null;
    
        // Handle errors    
        if (response.success) {
          if (isFollower == null) {
            throw new Error(`No status found`);
          } else {
            return isFollower;
          }
        } else {
          console.error(response);
          throw new Error(response.message ?? undefined);
        }
      }

      public async getFolloweeCount(
        request: GetCountRequest
      ): Promise<number> {
        const response = await this.clientCommunicator.doPost<
          GetCountRequest,
          GetCountResponse
        >(request, "/followeeCount");
    
        // Convert the UserDto array returned by ClientCommunicator to a User array
        const followeeCount: number | null = response.success && response.count ? response.count : null;
    
        // Handle errors    
        if (response.success) {
          if (followeeCount == null) {
            throw new Error(`No followee count found`);
          } else {
            return followeeCount;
          }
        } else {
          console.error(response);
          throw new Error(response.message ?? undefined);
        }
      }

      public async getFollowerCount(
        request: GetCountRequest
      ): Promise<number> {
        const response = await this.clientCommunicator.doPost<
          GetCountRequest,
          GetCountResponse
        >(request, "/followerCount");
    
        // Convert the UserDto array returned by ClientCommunicator to a User array
        const followerCount: number | null = response.success && response.count ? response.count : null;
    
        // Handle errors    
        if (response.success) {
          if (followerCount == null) {
            throw new Error(`No follower count found`);
          } else {
            return followerCount;
          }
        } else {
          console.error(response);
          throw new Error(response.message ?? undefined);
        }
      }
  }