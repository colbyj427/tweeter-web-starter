import { StatusDto, User } from "tweeter-shared";
import { StatusDaoInterface } from "../Daos/StatusDaoInterface";
import { StatusEntity } from "../Entity/StatusEntity";
import { FollowerDao } from "../Daos/FollowerDaoInterface";
import { UserDaoInterface } from "../Daos/UserDaoInterface";

export class StatusService {
  private statusDao: StatusDaoInterface;
  private followerDao: FollowerDao;
  private userDao: UserDaoInterface;
  
  constructor(statusDao: StatusDaoInterface, followerDao: FollowerDao, userDao: UserDaoInterface) {
    this.statusDao = statusDao;
    this.followerDao = followerDao;
    this.userDao = userDao
  }

    public async loadMoreStoryItems (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        const isExpired = await this.userDao.getSession(authToken);
        if (isExpired) {
          throw new Error("Must log in again");
        }

        let page = await this.statusDao.getPageOfStory(userAlias, pageSize, lastItem ? lastItem.timestamp : undefined);
        const dtos = await Promise.all(page.values.map(async (status) => await this.dtoFromEntity(status)));
        return [dtos.filter((dto): dto is StatusDto => dto !== null), page.hasMorePages];
      };

      public async dtoFromEntity(entity: StatusEntity | null): Promise<StatusDto | null> {
        if (!entity) {
        return null;
        }
        const userEntity = await this.userDao.get(entity.user_handle);
        if (userEntity == null) {
          return null
        }
        const user = new User(userEntity.firstName, userEntity.lastName, userEntity.alias, userEntity.imageUrl);

        return {
          post: entity.status,
          user: user.dto,
          timestamp: entity.timestamp
        }
      }
    
      public async loadMoreFeedItems (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        const isExpired = await this.userDao.getSession(authToken);
        if (isExpired) {
          throw new Error("Must log in again");
        }
        let page = await this.statusDao.getPageOfFeed(userAlias, pageSize, lastItem ? lastItem.timestamp : undefined);
        const dtos = await Promise.all(page.values.map(async (status) => await this.dtoFromEntity(status)));
        return [dtos.filter((dto): dto is StatusDto => dto !== null), page.hasMorePages];
      };

      public async postStatus (
        token: string,
        newStatus: StatusDto
      ): Promise<void> {
        const isExpired = await this.userDao.getSession(token);
        if (isExpired) {
          throw new Error("Must log in again");
        }

        const statusEntity = new StatusEntity(
          newStatus.user.alias,
          newStatus.post,
          newStatus.timestamp
        )
        this.statusDao.putInStory(statusEntity)

        //Next we need to get all the users following this user, and add the story to each of their feeds.
        //query all the followers,
        //add the status to the feed one at a time,
        let lastHandle: string | undefined = undefined;
        let hasMore = true;

        while (hasMore) {
          let page = await this.followerDao.getPageOfFollowers(newStatus.user.alias, 10, lastHandle);
          for (const follower of page.values) {
            const followerAlias = follower.follower_handle;
            await this.statusDao.putInFeed(followerAlias, statusEntity);
          }
          if (page.values.length > 0) {
            lastHandle = page.values[page.values.length - 1].follower_handle;
          } else {
            hasMore = false;
          }
        }
      };
}