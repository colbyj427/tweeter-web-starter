import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import React from "react";
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login component", () => {
    it("start with the sign-in button disabled.", () => {
        const { signInButton } = renderLoginAndGetElement("/");
        expect(signInButton).toBeDisabled();
    });

    it("enables the sign-in button when both the alias and password fields have text.", async () => {
        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/");

        await user.type(aliasField, "alias")
        await user.type(passwordField, "password")

        expect(signInButton).toBeEnabled();
    });

    it("Disables the sign-in button if either the alias or password field is cleared.", async () => {
        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/");

        await user.type(aliasField, "alias");
        await user.type(passwordField, "password");
        expect(signInButton).toBeEnabled();

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await user.type(aliasField, "alias");
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    });

    it("Calls the presenter's login method with correct parameters when the sign-in button is pressed.", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const originalUrl = "https://someurl.com"
        const alias = "@somealias"
        const password = "mypassword"
        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement(originalUrl, mockPresenterInstance);

        await user.type(aliasField, alias);
        await user.type(passwordField, password);
        await user.click(signInButton);

        verify(mockPresenter.doAuthenticate(anything(), anything(), alias, password, anything(), anything(), anything(), originalUrl)).once();
    });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
    return render(
    <MemoryRouter>
        {!!presenter ? (<Login originalUrl={originalUrl} presenter={presenter} />) : (<Login originalUrl={originalUrl} />)}
    </MemoryRouter>);
}

const renderLoginAndGetElement = (originalUrl: string, presenter?: LoginPresenter) => {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", { name: /Sign in/i });
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { signInButton, aliasField, passwordField, user };
}