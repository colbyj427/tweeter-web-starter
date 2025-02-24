import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import useUserInfoHook from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { UserItemView } from "./presenters/UserItemPresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { StatusItemView } from "./presenters/StatusItemPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import UserItem from "./components/userItem/UserItem";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { PagedItemPresenter, PagedItemView } from "./presenters/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import { UserService } from "./model/service/UserService";
import StatusItem from "./components/statusItem/statusItem";

const App = () => {
  const { currentUser, authToken } = useUserInfoHook();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  
  

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed" 
          element={
          <ItemScroller 
          key={3}
          presenterGenerator={(view: PagedItemView<Status>) => new StoryPresenter(view)}
          itemComponent={StatusItem}
          />
          } 
          />
        <Route 
          path="story" 
          element={
          <ItemScroller 
          key={4}
          //presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
          presenterGenerator={(view: PagedItemView<Status>) => new StoryPresenter(view)}
          itemComponent={StatusItem}
          />
          }
          />
        <Route
          path="followees"
          element={
            <ItemScroller
              key={1}
              //presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
              presenterGenerator={(view: PagedItemView<User>) => new FolloweePresenter(view)}
              itemComponent={UserItem}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={2} 
              //presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
              presenterGenerator={(view: PagedItemView<User>) => new FollowerPresenter(view)}
              itemComponent={UserItem}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
