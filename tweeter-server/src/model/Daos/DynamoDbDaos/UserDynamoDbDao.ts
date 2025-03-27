import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
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
              [this.imageUrlAttr]: user.imageUrl
            },
          };
          await this.client.send(new PutCommand(params));
    }

    async get(user: UserEntity): Promise<UserEntity | null> {
        const userEntity = new UserEntity(
            "firstName",
            "lastName",
            "alias",
            "password",
            "imageUrl"
          )
        return userEntity
    }

    async update(oldUser: UserEntity, newUser: UserEntity): Promise<void> {

    }

    async delete(user: UserEntity): Promise<void> {

    }
}