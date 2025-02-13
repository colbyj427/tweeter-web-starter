import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
    displayErrorMessage: (message: string) => void,
    displayInfoMessage: (message: string,
        duration: number,
        bootstrapClasses?: string) => void,
    clearLastInfoMessage: () => void,
    updatePost: (post: string) => void;
}

export class PostStatusPresenter {
    private view: PostStatusView;
    private service: StatusService;
    private post: string = "";
    private isLoading: boolean = false;

    public constructor(view: PostStatusView) {
        this.view = view;
        this.service = new StatusService();
    }

    public async submitPost (event: React.MouseEvent, currentUser: User | null, authToken: AuthToken | null) {
        event.preventDefault();
    
        try {
          this.isLoading = true;
          this.view.displayInfoMessage("Posting status...", 0);
    
          const status = new Status(this.post, currentUser!, Date.now());
    
          await this.service.postStatus(authToken!, status);
    
          this.post = ""
          this.view.updatePost("")
          this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to post the status because of exception: ${error}`
          );
        } finally {
          this.view.clearLastInfoMessage();
          this.isLoading = false;
        }
    };

    public clearPost = (event: React.MouseEvent) => {
        event.preventDefault();
        this.post = ""
        this.view.updatePost("")
    };
}