import { StatusDto, User, UserDto } from "tweeter-shared";
import { StatusDaoInterface } from "../Daos/StatusDaoInterface";
import { StatusEntity } from "../Entity/StatusEntity";
import { FollowerDao } from "../Daos/FollowerDaoInterface";
import { UserDaoInterface } from "../Daos/UserDaoInterface";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class StatusService {
  private statusDao: StatusDaoInterface;
  private followerDao: FollowerDao;
  private userDao: UserDaoInterface;
  private sqsClient = new SQSClient();
  
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
        // let lastHandle: string | undefined = undefined;
        // let hasMore = true;

        // while (hasMore) {
        //   let page = await this.followerDao.getPageOfFollowers(newStatus.user.alias, 10, lastHandle);
        //   for (const follower of page.values) {
        //     const followerAlias = follower.follower_handle;
        //     await this.statusDao.putInFeed(followerAlias, statusEntity);
        //   }
        //   if (page.values.length > 0) {
        //     lastHandle = page.values[page.values.length - 1].follower_handle;
        //   } else {
        //     hasMore = false;
        //   }
        // }
      };

      public async sendStatusMessage(sqs_url: string, messageBody: string): Promise<void> {
        //const sqs_url = "https://sqs.us-west-1.amazonaws.com/050451373472/PostStatusQueue";
        //const messageBody = "test message from SQS client"; // Replace with your message

        const params = {
          DelaySeconds: 10,
          MessageBody: messageBody, // Serialize the StatusDto object to a JSON string
          QueueUrl: sqs_url,
        };
      
        try {
          const data = await this.sqsClient.send(new SendMessageCommand(params));
          console.log("Success, message sent. MessageID:", data.MessageId);
        } catch (err) {
          throw err;
        }
      }

      //This is the function that will be called by the lambda to post to the feeds
      //It will take in a list of followers and a status, and post the status to each of the followers feeds
      public async postToFeeds(followers: UserDto[], newStatus: StatusDto): Promise<void> {
        const statusEntity = new StatusEntity(
          newStatus.user.alias,
          newStatus.post,
          newStatus.timestamp
        )
        

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
      }

      // async createUsers(userList: User[], password: string) {
      //   if (userList.length == 0) {
      //     console.log("zero followers to batch write");
      //     return;
      //   }
    
      //   const hashedPassword = await bcrypt.hash(password, 10);
    
      //   const params = {
      //     RequestItems: {
      //       [this.tableName]: this.createPutUserRequestItems(
      //         userList,
      //         hashedPassword
      //       ),
      //     },
      //   };
    
      //   try {
      //     const resp = await this.client.send(new BatchWriteCommand(params));
      //     await this.putUnprocessedItems(resp, params);
      //   } catch (err) {
      //     throw new Error(
      //       `Error while batch writing users with params: ${params}: \n${err}`
      //     );
      //   }
      // }
    
}