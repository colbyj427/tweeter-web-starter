import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  import { Follower } from "../../Entity/Follower";
  import { DataPage } from "../../Entity/DataPage";
  import { FollowerDao } from "../FollowerDaoInterface";
  
  export class followerDao implements FollowerDao {
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly follower_handleAttr = "follower_handle";
    readonly followee_handleAttr = "followee_handle";
    readonly follower_nameAttr = "follower_name";
    readonly followee_nameAttr = "followee_name";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  
  
    async put(user: Follower): Promise<void> {
      const params = {
        TableName: this.tableName,
        Item: {
          [this.follower_handleAttr]: user.follower_handle,
          [this.followee_handleAttr]: user.followee_handle,
          [this.follower_nameAttr]: user.follower_name,
          [this.followee_nameAttr]: user.followee_name
        },
      };
      await this.client.send(new PutCommand(params));
    }
  
    async get(user: Follower): Promise<Follower | null> {
      const params = {
        TableName: this.tableName,
        Key: { 
          [this.follower_handleAttr]: user.follower_handle, 
          [this.followee_handleAttr]: user.followee_handle
          // [this.followee_nameAttr]: user.followee_name, [this.follower_nameAttr]: user.follower_name
         },
      };
      const output = await this.client.send(new GetCommand(params));
      if (output.Item === undefined) {
        console.log("get returned undefined")
        return null;
      } else {
        return new  Follower(
          output.Item[this.follower_handleAttr],
          output.Item[this.follower_handleAttr],
          output.Item[this.follower_nameAttr],
          output.Item[this.followee_nameAttr]
        )
      }
    }
  
    async update(oldUser: Follower, newUser: Follower): Promise<void> {
      const params = {
        TableName: this.tableName,
        Key: {
          [this.follower_handleAttr]: oldUser.follower_handle,
          [this.followee_handleAttr]: oldUser.followee_handle,
        },
        UpdateExpression: "set follower_name = :fn, followee_name = :ln",
        ExpressionAttributeValues: {
          ":fn": newUser.follower_name,
          ":ln": newUser.followee_name,
        },
      };
      await this.client.send(new UpdateCommand(params));
    }
  
    async delete(user: Follower): Promise<void> {
      const params = {
        TableName: this.tableName,
        Key: { [this.follower_handleAttr]: user.follower_handle, [this.followee_handleAttr]: user.followee_handle },
      };
      await this.client.send(new DeleteCommand(params));
    }
  
    async getPageOfFollowees(followerHandle: string,
      pageSize: number,
      lastFolloweeHandle: string | undefined): Promise<DataPage<Follower>> {
        const params = {
          KeyConditionExpression: this.follower_handleAttr + " = :v",
          ExpressionAttributeValues: {
            ":v": followerHandle,
          },
          TableName: this.tableName,
          Limit: pageSize,
          ExclusiveStartKey:
            lastFolloweeHandle === undefined
              ? undefined
              : {
                  [this.follower_handleAttr]: followerHandle,
                  [this.followee_handleAttr]: lastFolloweeHandle,
                },
        };
  
        const items: Follower[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
          items.push(
            new Follower(
              item[this.follower_handleAttr],
              item[this.followee_handleAttr],
              item[this.follower_nameAttr],
              item[this.followee_handleAttr]
            )
          )
        );
        return new DataPage<Follower>(items, hasMorePages);
      }
  
      async getPageOfFollowers(followeeHandle: string, 
        pageSize: number, 
        lastFollowerHandle: string | undefined): Promise<DataPage<Follower>> {
          const params = {
            KeyConditionExpression: this.followee_handleAttr + " = :v",
            ExpressionAttributeValues: {
              ":v": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey:
              lastFollowerHandle === undefined
                ? undefined
                : {
                    [this.followee_handleAttr]: followeeHandle,
                    [this.follower_handleAttr]: lastFollowerHandle,
                  },
          };
    
          const items: Follower[] = [];
          const data = await this.client.send(new QueryCommand(params));
          const hasMorePages = data.LastEvaluatedKey !== undefined;
          data.Items?.forEach((item) =>
            items.push(
              new Follower(
                item[this.follower_handleAttr],
                item[this.followee_handleAttr],
                item[this.follower_nameAttr],
                item[this.followee_handleAttr]
              )
            )
          );
          return new DataPage<Follower>(items, hasMorePages);
        }
  }
