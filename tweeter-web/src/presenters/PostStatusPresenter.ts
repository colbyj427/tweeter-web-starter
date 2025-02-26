import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView{
    updatePost: (post: string) => void;
    clearPost: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private _service: StatusService;
    private _post: string = "";
    private isLoading: boolean = false;

    public constructor(view: PostStatusView) {
        super(view)
        this._service = new StatusService();
    }

    public get service() {
          if(this._service == null) {
            this._service = new StatusService();
          }
          return this._service;
        }
      
    public get post() {
      return this._post
    }

    public async submitPost (event: React.MouseEvent, currentUser: User | null, authToken: AuthToken | null) {
      event.preventDefault();
    
      this.doFailureReportingOperation(async () => {
        this.isLoading = true;
        this.view.displayInfoMessage("Posting status...", 0);
  
        const status = new Status(this.post, currentUser!, Date.now());
  
        await this.service.postStatus(authToken!, status);
  
        this._post = ""
        this.view.clearPost()
        this.view.displayInfoMessage("Status posted!", 2000);
      }, "post the status")
      this.view.clearLastInfoMessage(); //this is the finally
      this.isLoading = false;
    };

    // public clearPost = (event: React.MouseEvent) => {
    //     event.preventDefault();
    //     this._post = ""
    //     this.view.updatePost("")
    // };
}