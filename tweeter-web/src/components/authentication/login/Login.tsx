import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthFields from "../authFields/AuthFields";
import useUserInfoHook from "../../userInfo/UserInfoHook";
import { LoginPresenter, LoginView } from "../../../presenters/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoHook();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  // const doLogin = async () => {
  //   try {
  //     setIsLoading(true);

  //     const [user, authToken] = await login(alias, password);

  //     updateUserInfo(user, user, authToken, rememberMe);

  //     if (!!props.originalUrl) {
  //       navigate(props.originalUrl);
  //     } else {
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     displayErrorMessage(
  //       `Failed to log user in because of exception: ${error}`
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const login = async (
  //   alias: string,
  //   password: string
  // ): Promise<[User, AuthToken]> => {
  //   // TODO: Replace with the result of calling the server
  //   const user = FakeData.instance.firstUser;

  //   if (user === null) {
  //     throw new Error("Invalid alias or password");
  //   }

  //   return [user, FakeData.instance.authToken];
  // };

  const listener: LoginView = {
    updateUserInfo: (
      currentUser: User,
      displayedUser: User | null,
      authToken: AuthToken,
      remember: boolean
    ) => {
      updateUserInfo(currentUser, displayedUser, authToken, remember);
    },
    displayErrorMessage: displayErrorMessage,
    navigate: (url: string) => {
      navigate(url);
    }
  };

  const [presenter] = useState(new LoginPresenter(listener));


  const inputFieldGenerator = () => {
    return (
      <>
        <AuthFields 
        alias={alias}
        password={password}
        onAliasChange={setAlias}
        onPasswordChange={setPassword}
        submitButtonStatus={false}
        function={presenter.doLogin}/>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={() => presenter.doLogin(alias, password, rememberMe, props.originalUrl)}
    />
  );
};

export default Login;
