import { Buffer } from "buffer";
import { User, AuthToken, FakeData, UserDto } from "tweeter-shared";

export class UserService {
    public async login (
        alias: string,
        password: string
      ): Promise<[UserDto, string]> {
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;
        
        if (user === null) {
          throw new Error("Invalid alias or password");
        }
        const userDto = user.dto
        return [userDto, FakeData.instance.authToken.token];
      };

    public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
      ): Promise<[UserDto, string]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
          Buffer.from(userImageBytes).toString("base64");
    
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid registration");
        }
        const userDto = user.dto
        return [userDto, FakeData.instance.authToken.token];
      };

      public async logout (token: string): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
      };

      public async getUser (
        token: string,
        alias: string
      ): Promise<UserDto | null> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(alias)
      };

      private async getFakeData(alias: string): Promise<UserDto | null> {
        const userItem = FakeData.instance.findUserByAlias(alias);
        if (userItem) {
          const dto = userItem.dto
          return dto
        }
        return null
      }
}