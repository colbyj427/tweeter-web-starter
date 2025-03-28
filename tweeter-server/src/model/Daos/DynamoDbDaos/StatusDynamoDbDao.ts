import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  import { StatusEntity } from "../../Entity/StatusEntity";
  import { StatusDaoInterface } from "../StatusDaoInterface";
import { DataPage } from "../../Entity/DataPage";
  
  export class StatusDao implements StatusDaoInterface {
    readonly StoryTableName = "story";
    readonly FeedTableName = "feed"
    readonly poster_handleAttr = "user_handle";
    readonly timestampAttr = "timestamp";
    readonly statusAttr = "status";
    readonly ownerAttr = "feed_owner_handle"
    

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  
  
    async putInStory(status: StatusEntity): Promise<void> {
      const params = {
        TableName: this.StoryTableName,
        Item: {
          [this.poster_handleAttr]: status.user_handle,
          [this.timestampAttr]: status.timestamp,
          [this.statusAttr]: status.status
        },
      };
      await this.client.send(new PutCommand(params));
    }

    async putInFeed(owner_handle: string, status: StatusEntity): Promise<void> {
        const params = {
          TableName: this.FeedTableName,
          Item: {
            [this.ownerAttr]: owner_handle,
            [this.timestampAttr]: status.timestamp,
            [this.poster_handleAttr]: status.user_handle,
            [this.statusAttr]: status.status
          },
        };
        await this.client.send(new PutCommand(params));
      }
  
    async getStoryItem(status: StatusEntity): Promise<StatusEntity | null> {
        const params = {
            TableName: this.StoryTableName,
            Key: {
                [this.poster_handleAttr]: status.user_handle,
                [this.timestampAttr]: status.timestamp
            },
        };
        const output = await this.client.send(new GetCommand(params));
        if (output.Item === undefined) {
            console.log("get returned undefined")
            return null;
        } else {
            return new StatusEntity(
                output.Item[this.poster_handleAttr],
                output.Item[this.statusAttr],
                output.Item[this.timestampAttr]
            )
        }
    }
    // async getFeedItem(status: StatusEntity): Promise<StatusEntity | null> {

    // }

    async update(oldStatus: StatusEntity, newStatus: StatusEntity): Promise<void> {

    }
    async delete(status: StatusEntity): Promise<void> {

    }

    async getPageOfStory(userHandle: string, pageSize: number, lastStoryStamp: number | undefined): Promise<DataPage<StatusEntity>> {
        const params = {
            KeyConditionExpression: this.poster_handleAttr + " = :v",
            ExpressionAttributeValues: {
                ":v": userHandle,
            },
            TableName: this.StoryTableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastStoryStamp === undefined
                ? undefined
                : {
                    [this.poster_handleAttr]: userHandle,
                    [this.timestampAttr]: lastStoryStamp,
                },
        };
        const items: StatusEntity[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                new StatusEntity(
                    item[this.poster_handleAttr],
                    item[this.statusAttr],
                    item[this.timestampAttr]
                )
            )
        );
        return new DataPage<StatusEntity>(items, hasMorePages);
    }
    async getPageOfFeed(userHandle: string, pageSize: number, lastStoryStamp: number | undefined): Promise<DataPage<StatusEntity>> {
      const params = {
        KeyConditionExpression: this.ownerAttr + " = :v",
        ExpressionAttributeValues: {
          ":v": userHandle,
        },
        TableName: this.FeedTableName,
        Limit: pageSize,
        ExclusiveStartKey:
          lastStoryStamp === undefined ? undefined : 
          {
            [this.ownerAttr]: userHandle,
            [this.timestampAttr]: lastStoryStamp,
          },
      };
      const items: StatusEntity[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => 
        items.push(
          new StatusEntity(
            item[this.poster_handleAttr],
            item[this.statusAttr],
            item[this.timestampAttr]
          )
        )
      );
      return new DataPage<StatusEntity>(items, hasMorePages);
    }
  
    // async get(user: StatusEntity): Promise<StatusEntity | null> {
    //   const params = {
    //     TableName: this.tableName,
    //     Key: { 
    //       [this.follower_handleAttr]: user.follower_handle, 
    //       [this.followee_handleAttr]: user.followee_handle
    //       // [this.followee_nameAttr]: user.followee_name, [this.follower_nameAttr]: user.follower_name
    //      },
    //   };
    //   const output = await this.client.send(new GetCommand(params));
    //   if (output.Item === undefined) {
    //     console.log("get returned undefined")
    //     return null;
    //   } else {
    //     return new  StatusEntity(
    //       output.Item[this.follower_handleAttr],
    //       output.Item[this.follower_handleAttr],
    //       output.Item[this.follower_nameAttr],
    //       output.Item[this.followee_nameAttr]
    //     )
    //   }
    // }
  
    // async update(oldUser: StatusEntity, newUser: StatusEntity): Promise<void> {
    //   const params = {
    //     TableName: this.tableName,
    //     Key: {
    //       [this.follower_handleAttr]: oldUser.follower_handle,
    //       [this.followee_handleAttr]: oldUser.followee_handle,
    //     },
    //     UpdateExpression: "set follower_name = :fn, followee_name = :ln",
    //     ExpressionAttributeValues: {
    //       ":fn": newUser.follower_name,
    //       ":ln": newUser.followee_name,
    //     },
    //   };
    //   await this.client.send(new UpdateCommand(params));
    // }
  
    // async delete(user: StatusEntity): Promise<void> {
    //   const params = {
    //     TableName: this.tableName,
    //     Key: { [this.follower_handleAttr]: user.follower_handle, [this.followee_handleAttr]: user.followee_handle },
    //   };
    //   await this.client.send(new DeleteCommand(params));
    // }
  
    // async getPageOfFollowees(followerHandle: string,
    //   pageSize: number,
    //   lastFolloweeHandle: string | undefined): Promise<DataPage<StatusEntity>> {
    //     const params = {
    //       KeyConditionExpression: this.follower_handleAttr + " = :v",
    //       ExpressionAttributeValues: {
    //         ":v": followerHandle,
    //       },
    //       TableName: this.tableName,
    //       Limit: pageSize,
    //       ExclusiveStartKey:
    //         lastFolloweeHandle === undefined
    //           ? undefined
    //           : {
    //               [this.follower_handleAttr]: followerHandle,
    //               [this.followee_handleAttr]: lastFolloweeHandle,
    //             },
    //     };
  
    //     const items: StatusEntity[] = [];
    //     const data = await this.client.send(new QueryCommand(params));
    //     const hasMorePages = data.LastEvaluatedKey !== undefined;
    //     data.Items?.forEach((item) =>
    //       items.push(
    //         new StatusEntity(
    //           item[this.follower_handleAttr],
    //           item[this.followee_handleAttr],
    //           item[this.follower_nameAttr],
    //           item[this.followee_handleAttr]
    //         )
    //       )
    //     );
    //     return new DataPage<StatusEntity>(items, hasMorePages);
    //   }
  
    //   async getPageOfFollowers(followeeHandle: string, 
    //     pageSize: number, 
    //     lastFollowerHandle: string | undefined): Promise<DataPage<StatusEntity>> {
    //       const params = {
    //         KeyConditionExpression: this.followee_handleAttr + " = :v",
    //         ExpressionAttributeValues: {
    //           ":v": followeeHandle,
    //         },
    //         TableName: this.tableName,
    //         IndexName: this.indexName,
    //         Limit: pageSize,
    //         ExclusiveStartKey:
    //           lastFollowerHandle === undefined
    //             ? undefined
    //             : {
    //                 [this.followee_handleAttr]: followeeHandle,
    //                 [this.follower_handleAttr]: lastFollowerHandle,
    //               },
    //       };
    
    //       const items: StatusEntity[] = [];
    //       const data = await this.client.send(new QueryCommand(params));
    //       const hasMorePages = data.LastEvaluatedKey !== undefined;
    //       data.Items?.forEach((item) =>
    //         items.push(
    //           new StatusEntity(
    //             item[this.follower_handleAttr],
    //             item[this.followee_handleAttr],
    //             item[this.follower_nameAttr],
    //             item[this.followee_handleAttr]
    //           )
    //         )
    //       );
    //       return new DataPage<StatusEntity>(items, hasMorePages);
    //     }
  }
