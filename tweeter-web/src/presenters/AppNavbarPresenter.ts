import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";

export interface AppNavbarView extends MessageView {
    ClearUserInfo: () => void
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    private _userService: UserService | null = null;

    public constructor(view: AppNavbarView) {
      super(view);
    }

    public get userService() {
      if(this._userService == null) {
        this._userService = new UserService();
      }
      return this._userService;
    }

    public async logOut (authToken: AuthToken | null) {
      this.view.displayInfoMessage("Logging Out...", 0);
    
      this.doFailureReportingOperation(async () => {
        await this.userService.logout(authToken!);
  
        this.view.clearLastInfoMessage();
        this.view.ClearUserInfo();
      }, "log user out");
    };

}