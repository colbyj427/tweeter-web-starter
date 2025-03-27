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
    //readonly indexName = "follows_index";
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

    async update(oldUser: UserEntity, newUser: UserEntity): Promise<void> {

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
}