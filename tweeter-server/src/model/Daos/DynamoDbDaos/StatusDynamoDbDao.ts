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
  }
