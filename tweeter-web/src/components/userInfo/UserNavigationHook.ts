import { useContext } from "react";
import { AuthToken, FakeData, User } from "tweeter-shared"
import { UserInfoContext } from "./UserInfoProvider";
import useToastListener from "../toaster/ToastListenerHook";
import { UserService } from "../../model/service/UserService";

interface NavigationHook {
    extractAlias: (value: string) => string;
    getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
    navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigationHook = (): NavigationHook => {
    const { setDisplayedUser, authToken, currentUser } =
    useContext(UserInfoContext);
    const { displayErrorMessage } = useToastListener()
    const userService = new UserService()

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
    
        try {
          const alias = extractAlias(event.target.toString());
    
          const user = await userService.getUser(authToken!, alias);
    
          if (!!user) {
            if (currentUser!.equals(user)) {
              setDisplayedUser(currentUser!);
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

    return {
        extractAlias: extractAlias,
        getUser: userService.getUser,
        navigateToUser: navigateToUser
    };
}

export default useUserNavigationHook