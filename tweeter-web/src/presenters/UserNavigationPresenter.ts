import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
    displayErrorMessage: (message: string) => void,
    updateDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter {
    private userService: UserService;
    private view: UserNavigationView;

    public constructor(view: UserNavigationView) {
            this.view = view;
            this.userService = new UserService();
        }
    
    public async navigateToUser (event: React.MouseEvent, authToken: AuthToken | null, currentUser: User | null): Promise<void> {
        event.preventDefault();
    
        try {
            const alias = this.extractAlias(event.target.toString());
    
            const user = await this.userService.getUser(authToken!, alias);
    
            if (!!user) {
            if (currentUser!.equals(user)) {
                this.view.updateDisplayedUser(currentUser!)
            } else {
                this.view.updateDisplayedUser(user)
            }
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
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