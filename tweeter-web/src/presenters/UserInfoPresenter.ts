import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView{
    SetIsFollower: (isFollower: boolean) => void,
    SetFolloweeCount: (count: number) => void,
    SetFollowerCount: (count: number) => void,
    SetIsLoading: (isLoading: boolean) => void,
    SetDisplayedUser: (user: User) => void
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private followService: FollowService;
    
    public constructor(view: UserInfoView) {
        super(view)
        this.followService = new FollowService();
    }

    public async setIsFollowerStatus (
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
        ) {
        this.doFailureReportingOperation(async () => {
            if (currentUser === displayedUser) {
                this.view.SetIsFollower(false);
            } else {
                this.view.SetIsFollower(
                    await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
                );
            }
        }, "determine follower status");
    };

    public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
        ) {
        this.doFailureReportingOperation(async () => {
            this.view.SetFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        }, "get followees count");
    };

    public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
        ) {
        this.doFailureReportingOperation(async () => {
            this.view.SetFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        }, "get followers count");
    };

    public async followDisplayedUser (
        event: React.MouseEvent, displayedUser: User, authToken: AuthToken
        ): Promise<void> {
        event.preventDefault();
        this.doFailureReportingOperation(async () => {
            this.view.SetIsLoading(true);
            this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

            const [followerCount, followeeCount] = await this.followService.follow(
            authToken!,
            displayedUser!
            );

            this.view.SetIsFollower(true);
            this.view.SetFollowerCount(followerCount);
            this.view.SetFolloweeCount(followeeCount);
        }, "follow user");
        
        this.view.clearLastInfoMessage(); //the finally lines
        this.view.SetIsLoading(false);
    };

    public async unfollowDisplayedUser (
        event: React.MouseEvent, displayedUser: User, authToken: AuthToken
      ): Promise<void> {
        event.preventDefault();
        this.doFailureReportingOperation(async () => {
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
        }, "unfollow user");
        this.view.clearLastInfoMessage(); //finally lines
        this.view.SetIsLoading(false);
        };

    public switchToLoggedInUser = (event: React.MouseEvent, currentUser: User): void => {
        event.preventDefault();
        this.view.SetDisplayedUser(currentUser!);
    };
}