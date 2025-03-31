import { Buffer } from "buffer";
import { User, AuthToken, FakeData, TweeterRequest, LoginRequest, RegisterRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  facade = new ServerFacade

    public async login (
        alias: string,
        password: string
      ): Promise<[User, AuthToken]> {
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid alias or password");
        }
    
        const req: LoginRequest = {
          token: "undefined",
          userAlias: "undefined",
          alias: alias,
          password: password
        };
        return this.facade.login(req)
      };

    public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
      ): Promise<[User, AuthToken]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
          Buffer.from(userImageBytes).toString("base64");
    
        const req: RegisterRequest = {
          token: "undefined",
          userAlias: "undefined",
          firstName: firstName,
          lastName: lastName,
          alias: alias,
          password: password,
          imageBytes: imageStringBase64,
          imageFileExtension: imageFileExtension
        };
        return this.facade.register(req)
        };

      public async logout (authToken: AuthToken): Promise<void> {
        const req: TweeterRequest = {
          token: authToken.token,
          userAlias: "Undefined"
        };
        this.facade.logout(req)
      };

      public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        const req: TweeterRequest = {
          token: authToken.token,
          userAlias: alias
        };
        return this.facade.getUser(req)
      };
}