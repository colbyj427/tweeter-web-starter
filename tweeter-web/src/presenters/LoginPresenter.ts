import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {

  public constructor(view: AuthenticationView) {
      super(view)
  }

  protected doAuthentication(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean): Promise<[User, AuthToken]> {
      return this.service.login( alias, password );
  }

  protected doNavigation(url: string | undefined): void {
    if (!!url) {
      this.view.navigate(url);
    } else {
      this.view.navigate("/");
    }
  }

  protected getItemDescription(): string {
    return "log user in";
  }
}