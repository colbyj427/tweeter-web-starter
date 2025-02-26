import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthFields from "../authFields/AuthFields";
import useUserInfoHook from "../../userInfo/UserInfoHook";
import { LoginPresenter } from "../../../presenters/LoginPresenter";
import { AuthenticationView } from "../../../presenters/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoHook();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const listener: AuthenticationView = {
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

  const [presenter] = useState(props.presenter ?? new LoginPresenter(listener));


  const inputFieldGenerator = () => {
    return (
      <>
        <AuthFields 
        alias={alias}
        password={password}
        onAliasChange={setAlias}
        onPasswordChange={setPassword}
        submitButtonStatus={false}
        function={presenter.doAuthenticate}/>
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
      submit={() => presenter.doAuthenticate("", "", alias, password, new Uint8Array(), "", rememberMe, props.originalUrl)}
    />
  );
};

export default Login;
