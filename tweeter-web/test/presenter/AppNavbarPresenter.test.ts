import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenters/AppNavbarPresenter"
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockUserService: UserService;

    let authToken = new AuthToken("token", Date.now());

    beforeEach(() => {
        mockAppNavbarView = mock<AppNavbarView>();
        const mockAppNavbarViewInstance = instance(mockAppNavbarView);

        const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarViewInstance));
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);

        when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
    });

    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockUserService.logout(authToken)).once();

        // let [capturedAuthToken] = capture(mockUserService.logout).last();
        // expect(capturedAuthToken).toEqual(authToken);
    });

    it("the presenter tells the view to clear the last info message, clear the user info", async() => {
        await appNavbarPresenter.logOut(authToken);

        verify(mockAppNavbarView.clearLastInfoMessage()).once();
        verify(mockAppNavbarView.ClearUserInfo()).once();
        verify(mockAppNavbarView.displayErrorMessage(anything())).never();
        //verify(mockAppNavbarView.navigateToLogin()).once();
    });

    it("the presenter tells the view to display an error message and does not tell it to clear the last info message or clear the user info.", async() => {
        const error = new Error("An error occurred");
        when(mockUserService.logout(authToken)).thenThrow(error);

        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).once();
        verify(mockAppNavbarView.clearLastInfoMessage()).never();
        verify(mockAppNavbarView.ClearUserInfo()).never();
    })
});