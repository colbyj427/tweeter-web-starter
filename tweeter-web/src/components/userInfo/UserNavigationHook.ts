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
}

const useUserNavigationHook = (): NavigationHook => {
    const { setDisplayedUser, updateUserInfo, clearUserInfo, currentUser, displayedUser, authToken } =
    useContext(UserInfoContext);

    return {
        currentUser: currentUser,
        displayedUser: displayedUser,
        authToken: authToken,
        setDisplayedUser: setDisplayedUser, 
        updateUserInfo: updateUserInfo,
        clearUserInfo: clearUserInfo
    };
}

export default useUserNavigationHook