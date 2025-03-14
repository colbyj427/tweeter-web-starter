import { AuthToken, User, FakeData, PagedUserItemRequest, IsFollowerRequest, GetCountRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
    facade = new ServerFacade;

    public async loadMoreFollowers (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        const req: PagedUserItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem
        };
        return this.facade.getMoreFollowers(req);
        //return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
      };
    
      public async loadMoreFollowees (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        const req: PagedUserItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem
        };
        return this.facade.getMoreFollowees(req);
        //return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
      };

      public async getIsFollowerStatus (
        authToken: AuthToken,
        user: User,
        selectedUser: User
      ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        const userAsDto = user.dto;
        const selectedUserAsDto = selectedUser.dto;
        const req: IsFollowerRequest = {
          token: authToken.token,
          userAlias: user.alias,
          user: userAsDto,
          selectedUser: selectedUserAsDto
        };
        return this.facade.getIsFollower(req)
        //return FakeData.instance.isFollower();
      };

      public async getFolloweeCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        const userAsDto = user.dto;
        const req: GetCountRequest = {
          token: authToken.token,
          userAlias: user.alias,
          user: userAsDto,
        };
        return this.facade.getFolloweeCount(req)
        //return FakeData.instance.getFolloweeCount(user.alias);
      };

      public async getFollowerCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        const userAsDto = user.dto;
        const req: GetCountRequest = {
          token: authToken.token,
          userAlias: user.alias,
          user: userAsDto,
        };
        return this.facade.getFollowerCount(req)
        //return FakeData.instance.getFollowerCount(user.alias);
      };

      public async follow (
        authToken: AuthToken,
        userToFollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        //const followerCount = await this.getFollowerCount(authToken, userToFollow);
        //const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
    
        const userAsDto = userToFollow.dto;
        const req: GetCountRequest = {
          token: authToken.token,
          userAlias: userToFollow.alias,
          user: userAsDto,
        };
        return this.facade.follow(req)
        //return [followerCount, followeeCount];
      };

      public async unfollow (
        authToken: AuthToken,
        userToUnfollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
        const userAsDto = userToUnfollow.dto;
        const req: GetCountRequest = {
          token: authToken.token,
          userAlias: userToUnfollow.alias,
          user: userAsDto,
        };
        return this.facade.unfollow(req)

        // const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
        // const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
    
        // return [followerCount, followeeCount];
      };
}