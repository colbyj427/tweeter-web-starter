import { GetCountRequest, GetCountResponse, IsFollowerRequest, IsFollowerResponse, TweeterRequest, TweeterResponse } from "tweeter-shared"
import { FollowService } from "../../model/service/FollowService"
import { followerDao } from "../../model/Daos/DynamoDbDaos/FollowerDynamoDbDao"

export const handler = async (request: GetCountRequest): Promise<GetCountResponse> => {
    const followService = new FollowService(new followerDao)
    const followerCount = await followService.getFollowerCount(request.token, request.user);

    return {
        success: true,
        message: null,
        count: followerCount
    }
}