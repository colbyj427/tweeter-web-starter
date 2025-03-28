import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  import { UserEntity } from "../../Entity/User";
  import { UserDaoInterface } from "../UserDaoInterface";

export class UserDynamoDbDao implements UserDaoInterface {
    readonly tableName = "users";
    readonly sessionsTableName = "sessions";
    readonly authTokenAttr = "auth_token";
    readonly timestampAttr = "time_stamp";
    readonly firstNameAttr = "first_name";
    readonly LastNameAttr = "last_name";
    readonly aliasAttr = "user_handle";
    readonly passwordAttr = "password";
    readonly imageUrlAttr = "image_url";
    readonly followersAttr = "follower_count";
    readonly followeesAttr = "followee_count";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async put(user: UserEntity): Promise<void> {
        //first the image needs to be stored and a url returned to store with the user

        const params = {
            TableName: this.tableName,
            Item: {
              [this.firstNameAttr]: user.firstName,
              [this.LastNameAttr]: user.lastName,
              [this.aliasAttr]: user.alias,
              [this.passwordAttr]: user.password,
              [this.imageUrlAttr]: user.imageUrl,
              [this.followersAttr]: 0,
              [this.followeesAttr]: 0
            },
          };
          await this.client.send(new PutCommand(params));
    }

    async get(alias: string): Promise<UserEntity | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.aliasAttr]: alias
            }
        };
        const output = await this.client.send(new GetCommand(params));
        if (output.Item === undefined) {
            console.log("user get returned undefined");
            return null;
        } else {
            return new UserEntity(
                output.Item[this.firstNameAttr],
                output.Item[this.LastNameAttr],
                output.Item[this.aliasAttr],
                output.Item[this.passwordAttr],
                output.Item[this.imageUrlAttr]
              )
        }
    }

    async getFollowerCount(alias: string): Promise<number | null> {
      const params = {
          TableName: this.tableName,
          Key: {
              [this.aliasAttr]: alias
          }
      };
      const output = await this.client.send(new GetCommand(params));
      if (output.Item === undefined) {
          console.log("user get returned undefined");
          throw new Error("No user found for getFollowerCount")
      } else {
          return output.Item[this.followersAttr]
      }
    }

    async getFolloweeCount(alias: string): Promise<number | null> {
      const params = {
          TableName: this.tableName,
          Key: {
              [this.aliasAttr]: alias
          }
      };
      const output = await this.client.send(new GetCommand(params));
      if (output.Item === undefined) {
          console.log("user get returned undefined");
          return null;
      } else {
          return output.Item[this.followeesAttr]
      }
    }

    async updateCounts(alias: string, followeeCount: number, followerCount: number): Promise<void> {
        const params = {
            TableName: this.tableName,
        Key: {
          [this.aliasAttr]: alias,
        },
        UpdateExpression: "set followee_count = :fn, follower_count = :ln",
        ExpressionAttributeValues: {
          ":fn": followeeCount,
          ":ln": followerCount,
        },
        };
        await this.client.send(new UpdateCommand(params));
    }

    async delete(user: UserEntity): Promise<void> {

    }

    async putImage(
        fileName: string,
        imageStringBase64Encoded: string
      ): Promise<string> {
        let decodedImageBuffer: Buffer = Buffer.from(
          imageStringBase64Encoded,
          "base64"
        );
        const s3Params = {
          Bucket: "colbystweeterbucket",
          Key: "image/" + fileName,
          Body: decodedImageBuffer,
          ContentType: "image/png",
          ACL: ObjectCannedACL.public_read,
        };
        const c = new PutObjectCommand(s3Params);
        const client = new S3Client({ region: "us-west-1" });
        try {
          await client.send(c);
          return (
          `https://${"colbystweeterbucket"}.s3.${"us-west-1"}.amazonaws.com/image/${fileName}`
          );
        } catch (error) {
          throw Error("s3 put image failed with: " + error);
        }
      }

    async getImage(fileName: string,
        imageStringBase64Encoded: string
      ): Promise<string> {
        return `https://${"colbystweeterbucket"}.s3.${"us-west-1"}.amazonaws.com/image/${"testFile.png"}`
    }

    async putSession(token: string, alias: string, timestamp: number): Promise<void> {
        const params = {
            TableName: this.sessionsTableName,
            Item: {
                [this.authTokenAttr]: token,
                [this.aliasAttr]: alias,
                [this.timestampAttr]: timestamp
            },
        };
        await this.client.send(new PutCommand(params));
    }

    //return if the session is expired or not
    async getSession(token: string): Promise<boolean> {
        const params = {
            TableName: this.sessionsTableName,
            Key: {
                [this.authTokenAttr]: token,
            },
        };
        const output = await this.client.send(new GetCommand(params));
        if (output.Item === undefined) {
            return false;
        } else {
            const now = Date.now();
            const TEN_MINUTES_IN_MS = 10 * 60 * 1000;
            const isExpired = now - output.Item[this.timestampAttr] > TEN_MINUTES_IN_MS;
            if (!isExpired) {
                this.updateSession(token, now);
            }
            return isExpired;
        }
    }

    async getAliasFromSession(token: string): Promise<string | null> {
      const params = {
          TableName: this.sessionsTableName,
          Key: {
              [this.authTokenAttr]: token,
          },
      };
      const output = await this.client.send(new GetCommand(params));
      if (output.Item === undefined) {
          return null;
      } else {
          return output.Item[this.aliasAttr];
      }
  }

    async updateSession(token: string, timestamp: number): Promise<void> {
        const params = {
            TableName: this.sessionsTableName,
            Key: {
                [this.authTokenAttr]: token
            },
            UpdateExpression: "set time_stamp = :fn",
            ExpressionAttributeValues: {
                ":fn": timestamp
            },
        };
        await this.client.send(new UpdateCommand(params));
    }
}
