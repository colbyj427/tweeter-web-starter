import { FollowActionResponse, GetCountRequest } from "tweeter-shared"
import { FollowService } from "../../model/service/FollowService"
import { followerDao } from "../../model/Daos/DynamoDbDaos/FollowerDynamoDbDao"
import { UserDynamoDbDao } from "../../model/Daos/DynamoDbDaos/UserDynamoDbDao"

export const handler = async (request: GetCountRequest): Promise<FollowActionResponse> => {
    const followService = new FollowService(new followerDao, new UserDynamoDbDao);
    const [followerCount, followeeCount]  = await followService.follow(request.token, request.user);

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}