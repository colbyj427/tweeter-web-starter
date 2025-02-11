
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

    const checkSubmitButtonStatus = (): boolean => {
        return !props.alias || !props.password;
      };

    const loginOrRegisterOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !checkSubmitButtonStatus()) {
          props.function();
        }
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