import { FollowService } from "../model/service/FollowService";
import { StatusService } from "../model/service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { UserItemView } from "./UserItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
    private statusService: StatusService;
    
    public constructor(view: StatusItemView) {
        super(view)
        this.statusService = new StatusService();
    }
}