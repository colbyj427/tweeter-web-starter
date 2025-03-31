import { Buffer } from "buffer";
import { User, AuthToken, FakeData, TweeterRequest, LoginRequest, RegisterRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  facade = new ServerFacade

    public async login (
        alias: string,
        password: string
      ): Promise<[User, AuthToken]> {
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid alias or password");
        }
    
        //return [user, FakeData.instance.authToken];
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
        console.log("The bytes in the service:");
        console.log(userImageBytes);
        const imageStringBase64: string =
          Buffer.from(userImageBytes).toString("base64");
        console.log("********Here are the bytes:");
        console.log(imageStringBase64);
    
        // TODO: Replace with the result of calling the server
        // const user = FakeData.instance.firstUser;
    
        // if (user === null) {
        //   throw new Error("Invalid registration");
        // }

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
    
        // return [user, FakeData.instance.authToken];
      };

      public async logout (authToken: AuthToken): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        const req: TweeterRequest = {
          token: authToken.token,
          userAlias: "Undefined"
        };
        this.facade.logout(req)
        //await new Promise((res) => setTimeout(res, 1000));
      };

      public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        const req: TweeterRequest = {
          token: authToken.token,
          userAlias: alias
        };
        return this.facade.getUser(req)
        //return FakeData.instance.findUserByAlias(alias);
      };
}