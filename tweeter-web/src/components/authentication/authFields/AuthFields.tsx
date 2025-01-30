import { useContext, useState } from "react";
import { UserInfoContext } from "../../userInfo/UserInfoProvider";
import { useNavigate } from "react-router-dom";
import useToastListener from "../../toaster/ToastListenerHook";
import { AuthToken, FakeData, User } from "tweeter-shared";

interface Props {
    originalUrl?: string;
    function: Function;
    submitButtonStatus: Boolean;
    alias: string;
    password: string;
    onAliasChange: (newAlias: string) => void;
    onPasswordChange: (newPassword: string) => void;
  }

const AuthFields = (props: Props) => {

    const [rememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { updateUserInfo } = useContext(UserInfoContext);
    const { displayErrorMessage } = useToastListener();

    const checkSubmitButtonStatus = (): boolean => {
        return !props.alias || !props.password;
      };

    const loginOrRegisterOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !checkSubmitButtonStatus()) {
          props.function();
        }
      };

    const doLogin = async () => {
    try {
        setIsLoading(true);

        const [user, authToken] = await login(props.alias, props.password);

        updateUserInfo(user, user, authToken, rememberMe);

        if (!!props.originalUrl) {
        navigate(props.originalUrl);
        } else {
        navigate("/");
        }
    } catch (error) {
        displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
        );
    } finally {
        setIsLoading(false);
    }
    };

    const login = async (
    alias: string,
    password: string
    ): Promise<[User, AuthToken]> => {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
        throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
    };

    return (
        <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={loginOrRegisterOnEnter}
            onChange={(event) => props.onAliasChange(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            placeholder="Password"
            onKeyDown={loginOrRegisterOnEnter}
            onChange={(event) => props.onPasswordChange(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
        </>
    );
}

export default AuthFields