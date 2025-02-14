import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {
    displayErrorMessage: (message: string) => void,
    displayInfoMessage: (message: string,
        duration: number,
        bootstrapClasses?: string) => void,
    clearLastInfoMessage: () => void,
    SetIsFollower: (isFollower: boolean) => void,
    SetFolloweeCount: (count: number) => void,
    SetFollowerCount: (count: number) => void,
    SetIsLoading: (isLoading: boolean) => void,
    SetDisplayedUser: (user: User) => void
}

export class UserInfoPresenter {
    private followService: FollowService;
    private view: UserInfoView;
    
    public constructor(view: UserInfoView) {
        this.view = view;
        this.followService = new FollowService();
    }

    public async setIsFollowerStatus (
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
        ) {
        try {
            if (currentUser === displayedUser) {
            this.view.SetIsFollower(false);
            } else {
            this.view.SetIsFollower(
                await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
            }
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to determine follower status because of exception: ${error}`
            );
        }
    };

    public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
        ) {
        try {
            this.view.SetFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to get followees count because of exception: ${error}`
            );
        }
        };

        public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
        ) {
        try {
            this.view.SetFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to get followers count because of exception: ${error}`
            );
        }
    };

    public async followDisplayedUser (
        event: React.MouseEvent, displayedUser: User, authToken: AuthToken
        ): Promise<void> {
        event.preventDefault();

        try {
            this.view.SetIsLoading(true);
            this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

            const [followerCount, followeeCount] = await this.followService.follow(
            authToken!,
            displayedUser!
            );

            this.view.SetIsFollower(true);
            this.view.SetFollowerCount(followerCount);
            this.view.SetFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to follow user because of exception: ${error}`
            );
        } finally {
            this.view.clearLastInfoMessage();
            this.view.SetIsLoading(false);
        }
    };

    public async unfollowDisplayedUser (
        event: React.MouseEvent, displayedUser: User, authToken: AuthToken
      ): Promise<void> {
        event.preventDefault();
    
        try {
            this.view.SetIsLoading(true);
            this.view.displayInfoMessage(
            `Unfollowing ${displayedUser!.name}...`,
            0
            );

            const [followerCount, followeeCount] = await this.followService.unfollow(
            authToken!,
            displayedUser!
            );

            this.view.SetIsFollower(false);
            this.view.SetFollowerCount(followerCount);
            this.view.SetFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to unfollow user because of exception: ${error}`
            );
        } finally {
            this.view.clearLastInfoMessage();
            this.view.SetIsLoading(false);
        }
        };

        public switchToLoggedInUser = (event: React.MouseEvent, currentUser: User): void => {
        event.preventDefault();
        this.view.SetDisplayedUser(currentUser!);
    };
}