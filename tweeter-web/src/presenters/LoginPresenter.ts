import { useNavigate } from "react-router-dom";
import useUserInfoHook from "../components/userInfo/UserInfoHook";
import { UserService } from "../model/service/UserService";
import { User, AuthToken } from "tweeter-shared";

export interface LoginView {
    displayErrorMessage: (message: string) => void
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
      ) => void,
    navigate: (url: string) => void;
}

export class LoginPresenter {
    private userService: UserService;
    private _isLoading = false;
    private view: LoginView;

    public constructor(view: LoginView) {
        this.view = view;
        this.userService = new UserService();
    }

    public async doLogin (alias: string, password: string, rememberMe: boolean, originalUrl: string | undefined) {
        try {
            this._isLoading = true;
    
          const [user, authToken] = await this.userService.login(alias, password);
    
          this.view.updateUserInfo(user, user, authToken, rememberMe);
    
          if (!!originalUrl) {
            this.view.navigate(originalUrl);
          } else {
            this.view.navigate("/");
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
          );
        } finally {
          this._isLoading = false;
        }
      };
}