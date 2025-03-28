import { User, FakeData, UserDto } from "tweeter-shared";
import { FollowerDao } from "../Daos/FollowerDaoInterface"
import { UserDaoInterface } from "../Daos/UserDaoInterface";
import { Follower } from "../Entity/Follower";

export class FollowService {
  private dao: FollowerDao;
  private userDao: UserDaoInterface;

  constructor(dao: FollowerDao, userDao: UserDaoInterface) {
    this.dao = dao;
    this.userDao = userDao;
  }

  public async loadMoreFollowers (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    const isExpired = await this.userDao.getSession(token);
    if (isExpired) {
      throw new Error("Must log in again");
    }
    let page = await this.dao.getPageOfFollowers(userAlias, pageSize, lastItem?.alias);
    const dtos = await Promise.all(page.values.map(async (user) => await this.dtoFromFollowerEntity(user)));
    return [dtos.filter((dto): dto is UserDto => dto !== null), page.hasMorePages];
    //return this.getFakeData(lastItem, pageSize, userAlias);
  };

  public async loadMoreFollowees (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    const isExpired = await this.userDao.getSession(token);
    if (isExpired) {
      throw new Error("Must log in again");
    }
    let page = await this.dao.getPageOfFollowees(userAlias, pageSize, lastItem?.alias);
    const dtos = await Promise.all(page.values.map(async (user) => await this.dtoFromFolloweeEntity(user)));
    return [dtos.filter((dto): dto is UserDto => dto !== null), page.hasMorePages];
    //return this.getFakeData(lastItem, pageSize, userAlias);
  };

  private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }

  public async getIsFollowerStatus (
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    const isExpired = await this.userDao.getSession(token);
    if (isExpired) {
      throw new Error("Must log in again");
    }
    const newEntity = new Follower(
      user.alias,
      selectedUser.alias,
      user.firstName,
      selectedUser.firstName
    )
    const entity = await this.dao.get(newEntity);
    if (entity === null) {
      return false;
    }
    return true;
  };

  public async getFolloweeCount (
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    //return FakeData.instance.getFolloweeCount(user.alias);
    const isExpired = await this.userDao.getSession(token);
    if (isExpired) {
      throw new Error("Must log in again");
    }
    const count = await this.userDao.getFolloweeCount(user.alias);
    if (count === null) {
      // throw new Error("No user found for counts");
      return 0;
    }
    return count;
  };

  public async getFollowerCount (
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    //return FakeData.instance.getFollowerCount(user.alias);
    const isExpired = await this.userDao.getSession(token);
    if (isExpired) {
      throw new Error("Must log in again");
    }
    const count = await this.userDao.getFollowerCount(user.alias);
    if (count === null) {
      // throw new Error("No user found for counts");
      return 0;
    }
    return count;
  };

  public async follow (
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Call the server
    const isExpired = await this.userDao.getSession(token);
    if (isExpired) {
      throw new Error("Must log in again");
    }
    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);
    await this.userDao.updateCounts(userToFollow.alias, followeeCount, followerCount + 1);

    //*****works to here */
    //add a follow to table
    const followerAlias = await this.userDao.getAliasFromSession(token);
    if (followerAlias === null) {
      throw new Error("User doesn't exist")
    }
    const followerUser = await this.userDao.get(followerAlias);
    if (followerUser === null) {
      throw new Error("User doesn't exist")
    }
    const actedFollowerCount = await this.getFollowerCount(token, followerUser);
    const actedFolloweeCount = await this.getFolloweeCount(token, followerUser);
    await this.userDao.updateCounts(followerAlias, actedFolloweeCount + 1, actedFollowerCount);
    const toAdd = new Follower(
      followerAlias,
      userToFollow.alias,
      followerUser.firstName,
      userToFollow.firstName
    )
    await this.dao.put(toAdd);

    return [followerCount + 1, followeeCount];
  };

  public async unfollow (
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Call the server
    const isExpired = await this.userDao.getSession(token);
    if (isExpired) {
      throw new Error("Must log in again");
    }

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
    await this.userDao.updateCounts(userToUnfollow.alias, followeeCount, followerCount - 1);

    //remove a follow from table
    const followerAlias = await this.userDao.getAliasFromSession(token);
    if (followerAlias === null) {
      throw new Error("User doesn't exist")
    }
    const followerUser = await this.userDao.get(followerAlias);
    if (followerUser === null) {
      throw new Error("User doesn't exist")
    }
    const actedFollowerCount = await this.getFollowerCount(token, followerUser);
    const actedFolloweeCount = await this.getFolloweeCount(token, followerUser);
    await this.userDao.updateCounts(followerAlias, actedFolloweeCount - 1, actedFollowerCount);
    const toAdd = new Follower(
      followerAlias,
      userToUnfollow.alias,
      followerUser.firstName,
      userToUnfollow.firstName
    )
    await this.dao.delete(toAdd);

    return [followerCount - 1, followeeCount];
  };

  public async dtoFromFollowerEntity(entity: Follower | null): Promise<UserDto | null> {
    if (!entity) {
    return null;
    }
    const userEntity = await this.userDao.get(entity.follower_handle);
    if (userEntity == null) {
      return null
    }
    const user = new User(userEntity.firstName, userEntity.lastName, userEntity.alias, userEntity.imageUrl);
    return user.dto;
  }

  public async dtoFromFolloweeEntity(entity: Follower | null): Promise<UserDto | null> {
    if (!entity) {
    return null;
    }
    const userEntity = await this.userDao.get(entity.followee_handle);
    if (userEntity == null) {
      return null
    }
    const user = new User(userEntity.firstName, userEntity.lastName, userEntity.alias, userEntity.imageUrl);
    return user.dto;
  }
}