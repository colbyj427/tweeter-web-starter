import { GetCountRequest, GetCountResponse, IsFollowerRequest, IsFollowerResponse, TweeterRequest, TweeterResponse } from "tweeter-shared"
import { FollowService } from "../../model/service/FollowService"

export const handler = async (request: GetCountRequest): Promise<GetCountResponse> => {
    const followService = new FollowService
    const followeeCount = await followService.getFolloweeCount(request.token, request.user);

    return {
        success: true,
        message: null,
        count: followeeCount
    }
}