import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import React, { useContext } from "react";
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import useUserInfoHook from "../../../src/components/userInfo/UserInfoHook";
import { AuthToken, User } from "tweeter-shared";
import { UserInfoContext } from "../../../src/components/userInfo/UserInfoProvider";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
    useUserInfoHook: jest.fn(),
}));  
describe("PostStatus component", () => {
    const mockAuthTokenInstance = new AuthToken("newToken", Date.now());
    const mockUserInstance = new User("first", "last", "alias", "url");
    // const useUserInfoHook = () => useContext(UserInfoContext);

    beforeAll( () => {
        (useUserInfoHook as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
          });     
    });


    it("start with the Post Status and Clear buttons disabled.", () => {
        const { postButton, clearButton } = renderPostStatusAndGetElement();
        expect(postButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("Both buttons are enabled when the text field has text.", async () => {
        const { postButton, clearButton, postField, user } = renderPostStatusAndGetElement();

        await user.type(postField, "test")

        expect(postButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it("Both buttons are disabled when the text field is cleared.", async () => {
        const { postButton, clearButton, postField, user } = renderPostStatusAndGetElement();

        await user.type(postField, "post")
        expect(postButton).toBeEnabled();
        expect(clearButton).toBeEnabled();

        await user.clear(postField);
        expect(postButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("Calls the presenter's postStatus method with correct parameters when the Post Status button is pressed.", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        
        const { postButton, postField, user } = renderPostStatusAndGetElement(mockPresenterInstance);
        const { currentUser, authToken } = useUserInfoHook();

        const post = "mypost"
        await user.type(postField, post);
        await user.click(postButton);

        verify(mockPresenter.submitPost(anything(), currentUser!, authToken!)).once();
    });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
    return render(
    <MemoryRouter>
        {!!presenter ? (<PostStatus presenter={presenter} />) : (<PostStatus />)}
    </MemoryRouter>);
}

const renderPostStatusAndGetElement = (presenter?: PostStatusPresenter) => {
    const user = userEvent.setup();

    renderPostStatus(presenter);

    const postButton = screen.getByRole("button", { name: /Post Status/i });
    const clearButton = screen.getByRole("button", { name: /Clear/i });
    const postField = screen.getByLabelText("post");

    return { postButton, clearButton, postField, user };
}