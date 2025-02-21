import { UserService } from "../model/service/UserService";
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View{
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
      ) => void,
    navigate: (url: string) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
    private userService: UserService;
    private _isLoading = false;

    public constructor(view: LoginView) {
        super(view)
        this.userService = new UserService();
    }

    public async doLogin (alias: string, password: string, rememberMe: boolean, originalUrl: string | undefined) {
      this.doFailureReportingOperation(async () => {
        this._isLoading = true;
    
        const [user, authToken] = await this.userService.login(alias, password);
  
        this.view.updateUserInfo(user, user, authToken, rememberMe);
  
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate("/");
        }
      }, "log user in");
      this._isLoading = false; //this was the finally
      };
}