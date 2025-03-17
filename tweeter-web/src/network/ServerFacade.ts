import {
    AuthToken,
    FollowActionResponse,
    GetCountRequest,
    GetCountResponse,
    GetUserResponse,
    IsFollowerRequest,
    IsFollowerResponse,
    LoginRegisterResponse,
    LoginRequest,
    PagedUserItemRequest,
    PagedUserItemResponse,
    PostStatusRequest,
    RegisterRequest,
    TweeterRequest,
    TweeterResponse,
    User,
    UserDto,
  } from "tweeter-shared";
  import { ClientCommunicator } from "./ClientCommunicator";
  
  export class ServerFacade {
    private SERVER_URL = "https://877ck2ig9a.execute-api.us-west-1.amazonaws.com/dev";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  
    //****************
    //FOLLOW
    //****************
    
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

      public async follow(
        request: GetCountRequest
      ): Promise<[followerCount: number, followeeCount: number]> {
        const response = await this.clientCommunicator.doPost<
          GetCountRequest,
          FollowActionResponse
        >(request, "/follow");
    
        const [followerCount, followeeCount]: [number, number] | [null, null] = response.success ? [response.followerCount, response.followeeCount] : [null, null];
    
        // Handle errors    
        if (response.success) {
          if (followerCount == null || followeeCount == null) {
            throw new Error(`Could not follow`);
          } else {
            return [followerCount, followeeCount];
          }
        } else {
          console.error(response);
          throw new Error(response.message ?? undefined);
        }
      }

      public async unfollow(
        request: GetCountRequest
      ): Promise<[followerCount: number, followeeCount: number]> {
        const response = await this.clientCommunicator.doPost<
          GetCountRequest,
          FollowActionResponse
        >(request, "/unfollow");
    
        const [followerCount, followeeCount]: [number, number] | [null, null] = response.success ? [response.followerCount, response.followeeCount] : [null, null];
    
        // Handle errors    
        if (response.success) {
          if (followerCount == null || followeeCount == null) {
            throw new Error(`Could not unfollow`);
          } else {
            return [followerCount, followeeCount];
          }
        } else {
          console.error(response);
          throw new Error(response.message ?? undefined);
        }
      }

      //****************
      //STATUS
      //****************

      public async postStatus(
        request: PostStatusRequest
      ): Promise<void> {
        const response = await this.clientCommunicator.doPost<
          PostStatusRequest,
          TweeterResponse
        >(request, "/postStatus");
        
        // Handle errors    
        if (!response.success) {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
      }

      //****************
      //USER
      //****************

    public async getUser(
    request: TweeterRequest
    ): Promise<User | null> {
        const response = await this.clientCommunicator.doPost<
            TweeterRequest,
            GetUserResponse
        >(request, "/getUser");

        // Convert the UserDto returned by ClientCommunicator to a User
        const item: User | null =
        response.success && response.user ? User.fromDto(response.user) : null;
        
        // Handle errors    
        if (response.success) {
            if (item == null) {
                throw new Error(`No user found`);
            } else {
                return item;
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async logout(
        request: TweeterRequest
        ): Promise<void> {
            const response = await this.clientCommunicator.doPost<
                TweeterRequest,
                TweeterResponse
            >(request, "/logout");
    
            // Handle errors    
        if (!response.success) {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async login(
    request: LoginRequest
    ): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
            LoginRequest,
            LoginRegisterResponse
        >(request, "/login");

        // Convert the UserDto returned by ClientCommunicator to a User
        const [user, token]: [User | null , string | null] =
        response.success && response.user ? [User.fromDto(response.user), response.token] : [null, null];
        
        // Handle errors    
        if (response.success) {
            if (user == null || token == null) {
                throw new Error(`No user found`);
            } else {
                const auth = new AuthToken(token, Date.now())
                return [user, auth];
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async register(
    request: RegisterRequest
    ): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
            RegisterRequest,
            LoginRegisterResponse
        >(request, "/register");

        // Convert the UserDto returned by ClientCommunicator to a User
        const [user, token]: [User | null , string | null] =
        response.success && response.user ? [User.fromDto(response.user), response.token] : [null, null];
        
        // Handle errors    
        if (response.success) {
            if (user == null || token == null) {
                throw new Error(`Couldn't create user`);
            } else {
                const auth = new AuthToken(token, Date.now())
                return [user, auth];
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }
  }