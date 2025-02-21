import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
    updateDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
    private userService: UserService;

    public constructor(view: UserNavigationView) {
        super(view)
        this.userService = new UserService();
    }
    
    public async navigateToUser (event: React.MouseEvent, authToken: AuthToken | null, currentUser: User | null): Promise<void> {
        event.preventDefault();
    
        this.doFailureReportingOperation(async () => {
            const alias = this.extractAlias(event.target.toString());
    
            const user = await this.userService.getUser(authToken!, alias);
    
            if (!!user) {
            if (currentUser!.equals(user)) {
                this.view.updateDisplayedUser(currentUser!)
            } else {
                this.view.updateDisplayedUser(user)
            }
            }
        }, "get user");
    };

    public extractAlias (value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    public async getUser (authToken: AuthToken, alias: string): Promise<User | null> {
        return (
            this.userService.getUser(authToken, alias)
        )
    }
}