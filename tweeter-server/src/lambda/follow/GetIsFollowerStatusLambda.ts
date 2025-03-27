import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared"
import { FollowService } from "../../model/service/FollowService"
import { followerDao } from "../../model/Daos/DynamoDbDaos/FollowerDynamoDbDao"

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
    const followService = new FollowService(new followerDao)
    const isFollower = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);

    return {
        success: true,
        message: null,
        isFollower: isFollower
    }
}