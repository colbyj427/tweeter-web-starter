import { FollowActionResponse, GetCountResponse, IsFollowerRequest } from "tweeter-shared"
import { FollowService } from "../../model/service/FollowService"

export const handler = async (request: IsFollowerRequest): Promise<FollowActionResponse> => {
    const followService = new FollowService
    const [followerCount, followeeCount]  = await followService.unfollow(request.token, request.selectedUser);

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}