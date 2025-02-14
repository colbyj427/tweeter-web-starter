import { useContext, useState } from "react";
import { AuthToken, User } from "tweeter-shared"
import { UserInfoContext } from "./UserInfoProvider";
import useToastListener from "../toaster/ToastListenerHook";
import { UserNavigationView, UserNavigationPresenter } from "../../presenters/UserNavigationPresenter";

interface NavigationHook {
    extractAlias: (value: string) => string;
    getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
    navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigationHook = (): NavigationHook => {
    const { setDisplayedUser, authToken, currentUser } =
    useContext(UserInfoContext);
    const { displayErrorMessage } = useToastListener()

    const listener: UserNavigationView = {
      displayErrorMessage: displayErrorMessage,
      updateDisplayedUser: setDisplayedUser
    };
      
    const [presenter] = useState(new UserNavigationPresenter(listener));

    return {
        extractAlias: presenter.extractAlias,
        getUser: presenter.userService.getUser,
        navigateToUser: (event: React.MouseEvent) => presenter.navigateToUser(event, authToken, currentUser)
    };
}

export default useUserNavigationHook