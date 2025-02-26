import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter"
import { AuthToken, Status, User } from "tweeter-shared";
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
    let postStatusPresenter: PostStatusPresenter;
    let mockPostStatusView: PostStatusView;
    let mockStatusService: StatusService;

    let authToken = new AuthToken("token", Date.now());
    let user = new User("first", "last", "alias", "image");
    let newStatus = new Status("", user, Date.now())
    let mockMouseEvent: React.MouseEvent = {
        bubbles: true,
        cancelable: true,
        view: window,
        nativeEvent: new Event('click'),
        preventDefault: () => true,
        isDefaultPrevented: () => true,
        isPropagationStopped: () => false,
        persist: () => { }
    } as unknown as React.MouseEvent;

    beforeEach( () => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);
        
        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);        

        when(postStatusPresenterSpy.service).thenReturn(mockStatusServiceInstance);
    })

    it("tells the view to display a posting status message.", async () => {
        await postStatusPresenter.submitPost(mockMouseEvent, user, authToken);
        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token.", async () => {
        await postStatusPresenter.submitPost(mockMouseEvent, user, authToken);
        verify(mockStatusService.postStatus(authToken, anything())).once();

        const [CapturedAuthToken, CapturedNewStatus] = capture(mockStatusService.postStatus).last();
        expect(CapturedNewStatus.post).toEqual(newStatus.post);
    });

    it("tells the view to clear the last info message, clear the post, and display a status posted message when successful.", async () => {
        await postStatusPresenter.submitPost(mockMouseEvent, user, authToken);

        verify(mockPostStatusView.clearLastInfoMessage()).once();
        //verify(postStatusPresenter.clearPost).once();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();

    });

    it("the presenter tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message.", async () => {
        const error = new Error("An error occurred");
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);
        
        await postStatusPresenter.submitPost(mockMouseEvent, user, authToken);

        verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();
        verify(mockPostStatusView.clearLastInfoMessage()).once();
        //does not tell it to clear the post:
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
    });
});