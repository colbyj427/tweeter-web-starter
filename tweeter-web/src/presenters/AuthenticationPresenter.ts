import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
      ) => void,
    navigate: (url: string) => void;
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
    private _service: UserService;
    protected _isLoading: boolean = false;

    public constructor(view: AuthenticationView) {
        super(view)
        this._service = new UserService();
    }

    protected get service () {
        return this._service;
    }

    protected get isLoading () {
        return this._isLoading;
    }

    public async doAuthenticate (firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean, originalUrl: string | undefined) {
        this.doFailureReportingOperation(async () => {
          this._isLoading = true
          const [user, authToken] = await this.doAuthentication(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension,
            rememberMe,
        );
    
        this.view.updateUserInfo(user, user, authToken, rememberMe);
        this.doNavigation(originalUrl);
        }, this.getItemDescription());
        this._isLoading = false //the finally
      };

    protected abstract doAuthentication(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string,
        rememberMe: boolean): Promise<[User, AuthToken]>

    protected abstract getItemDescription(): string;

    protected abstract doNavigation(url: string | undefined): void; 
}