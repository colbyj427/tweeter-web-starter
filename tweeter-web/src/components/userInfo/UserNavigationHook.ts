import { useContext } from "react";
import { AuthToken, User } from "tweeter-shared"
import { UserInfoContext } from "./UserInfoProvider";

interface NavigationHook {
    currentUser: User | null;
    displayedUser: User | null;
    authToken: AuthToken | null;
    setDisplayedUser: (user: User) => void;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
    clearUserInfo: () => void;
    extractAlias: (value: string) => string;
    getUser: (authToken: AuthToken, alias: string) => User | null;
    navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigationHook = (): NavigationHook => {
    const { setDisplayedUser, updateUserInfo, clearUserInfo, extractAlias, getUser, navigateToUser, currentUser, displayedUser, authToken } =
    useContext(UserInfoContext);

    return {
        currentUser: currentUser,
        displayedUser: displayedUser,
        authToken: authToken,
        setDisplayedUser: setDisplayedUser, 
        updateUserInfo: updateUserInfo,
        clearUserInfo: clearUserInfo,
        extractAlias: extractAlias,
        getUser: getUser,
        navigateToUser: navigateToUser
    };
}

export default useUserNavigationHook