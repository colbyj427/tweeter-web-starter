import { FakeData, Status, StatusDto, User } from "tweeter-shared";
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
        // TODO: Replace with the result of calling server
        //return this.getFakeData(lastItem, pageSize, userAlias)
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
    
      //****** change this to the feed from story */
      public async loadMoreFeedItems (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        //return this.getFakeData(lastItem, pageSize, userAlias)
        const isExpired = await this.userDao.getSession(authToken);
        if (isExpired) {
          throw new Error("Must log in again");
        }
        let page = await this.statusDao.getPageOfFeed(userAlias, pageSize, lastItem ? lastItem.timestamp : undefined);
        const dtos = await Promise.all(page.values.map(async (status) => await this.dtoFromEntity(status)));
        return [dtos.filter((dto): dto is StatusDto => dto !== null), page.hasMorePages];
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
        const isExpired = await this.userDao.getSession(token);
        if (isExpired) {
          throw new Error("Must log in again");
        }

        const statusEntity = new StatusEntity(
          newStatus.user.alias,
          newStatus.post,
          newStatus.timestamp
        )
        // TODO: Call the server to post the status
        this.statusDao.putInStory(statusEntity)

        //Next we need to get all the users following this user, and add the story to each of their feeds.
        //query all the followers,
        //add the status to the feed one at a time,
        let lastHandle: string | undefined = undefined;
        let hasMore = true;

        const followerAlias = "colbytest"
        await this.statusDao.putInFeed(followerAlias, statusEntity);
        while (hasMore) {
          let page = await this.followerDao.getPageOfFollowers(newStatus.user.alias, 10, lastHandle);
          for (const follower of page.values) {
            //*** if im getting statuses in reveresed places, check this line below.  */
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