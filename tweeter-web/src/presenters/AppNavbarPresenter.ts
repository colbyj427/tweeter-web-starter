import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { RegisterView } from "./RegisterPresenter";

export interface AppNavbarView {
    displayErrorMessage: (message: string) => void,
    displayInfoMessage: (message: string,
        duration: number,
        bootstrapClasses?: string) => void,
    clearLastInfoMessage: () => void,
    ClearUserInfo: () => void
}

export class AppNavbarPresenter {
    private userService: UserService;
    private view: AppNavbarView;

    public constructor(view: AppNavbarView) {
        this.view = view;
        this.userService = new UserService();
    }

    public async logOut (authToken: AuthToken | null) {
        this.view.displayInfoMessage("Logging Out...", 0);
    
        try {
          await this.userService.logout(authToken!);
    
          this.view.clearLastInfoMessage();
          this.view.ClearUserInfo();
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`
          );
        }
      };

}