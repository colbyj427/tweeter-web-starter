import { Context, createContext, useState } from "react";
import { User, AuthToken, FakeData } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";

const CURRENT_USER_KEY: string = "CurrentUserKey";
const AUTH_TOKEN_KEY: string = "AuthTokenKey";

interface UserInfo {
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  clearUserInfo: () => void;
  setDisplayedUser: (user: User) => void;
  extractAlias: (value: string) => string;
  getUser: (authToken: AuthToken, alias: string) => User | null;
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const defaultUserInfo: UserInfo = {
  currentUser: null,
  displayedUser: null,
  authToken: null,
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean = false
  ) => null,
  clearUserInfo: () => null,
  setDisplayedUser: (user) => null,
  extractAlias: (value: string) => "",
  getUser: (authToken: AuthToken, alias: string) => null,
  navigateToUser: async (event: React.MouseEvent) => {}
};

export const UserInfoContext: Context<UserInfo> =
  createContext<UserInfo>(defaultUserInfo);
  const { displayErrorMessage } = useToastListener();

interface Props {
  children: React.ReactNode;
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
  const saveToLocalStorage = (
    currentUser: User,
    authToken: AuthToken
  ): void => {
    localStorage.setItem(CURRENT_USER_KEY, currentUser.toJson());
    localStorage.setItem(AUTH_TOKEN_KEY, authToken.toJson());
  };

  const retrieveFromLocalStorage = (): {
    currentUser: User | null;
    displayedUser: User | null;
    authToken: AuthToken | null;
  } => {
    const loggedInUser = User.fromJson(localStorage.getItem(CURRENT_USER_KEY));
    const authToken = AuthToken.fromJson(localStorage.getItem(AUTH_TOKEN_KEY));

    if (!!loggedInUser && !!authToken) {
      return {
        currentUser: loggedInUser,
        displayedUser: loggedInUser,
        authToken: authToken,
      };
    } else {
      return { currentUser: null, displayedUser: null, authToken: null };
    }
  };

  const clearLocalStorage = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const [userInfo, setUserInfo] = useState({
    ...defaultUserInfo,
    ...retrieveFromLocalStorage(),
  });

  const updateUserInfo = (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => {
    setUserInfo({
      ...userInfo,
      currentUser: currentUser,
      displayedUser: displayedUser,
      authToken: authToken,
    });

    if (remember) {
      saveToLocalStorage(currentUser, authToken);
    }
  };

  const clearUserInfo = () => {
    setUserInfo({
      ...userInfo,
      currentUser: null,
      displayedUser: null,
      authToken: null,
    });
    clearLocalStorage();
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const user = await getUser(defaultUserInfo.authToken!, alias);

      if (!!user) {
        if (defaultUserInfo.currentUser!.equals(user)) {
          setDisplayedUser(defaultUserInfo.currentUser!);
        } else {
          setDisplayedUser(user);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  const setDisplayedUser = (user: User) => {
    setUserInfo({ ...userInfo, displayedUser: user });
  };

  return (
    <UserInfoContext.Provider
      value={{
        ...userInfo,
        updateUserInfo: updateUserInfo,
        clearUserInfo: clearUserInfo,
        setDisplayedUser: setDisplayedUser,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
