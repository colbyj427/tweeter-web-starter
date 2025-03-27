import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  import { User } from "../../Entity/User";
  import { UserDaoInterface } from "../UserDaoInterface";

export class UserDynamoDbDao implements UserDaoInterface {
    readonly tableName = "users";
    //readonly indexName = "follows_index";
    readonly firstName = "first_name";
    readonly LastName = "last_name";
    readonly alias = "alias";
    readonly password = "password";
    readonly imageUrl = "image_url"

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async put(user: User): Promise<void> {
        //first the image needs to be stored and a url returned to store with the user
        
        const params = {
            TableName: this.tableName,
            Item: {
              [this.firstName]: user.firstName,
              [this.LastName]: user.lastName,
              [this.alias]: user.alias,
              [this.password]: user.password,
              [this.imageUrl]: user.imageUrl
            },
          };
          await this.client.send(new PutCommand(params));
    }

    async get(user: User): Promise<User | null> {
        return null
    }

    async update(oldUser: User, newUser: User): Promise<void> {

    }

    async delete(user: User): Promise<void> {

    }
}