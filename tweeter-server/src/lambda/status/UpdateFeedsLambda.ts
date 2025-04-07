import { PostStatusRequest, TweeterResponse } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { StatusDao } from "../../model/Daos/DynamoDbDaos/StatusDynamoDbDao";
import { followerDao } from "../../model/Daos/DynamoDbDaos/FollowerDynamoDbDao";
import { UserDynamoDbDao } from "../../model/Daos/DynamoDbDaos/UserDynamoDbDao";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
    const statusService = new StatusService(new StatusDao, new followerDao, new UserDynamoDbDao);
    //send the post to be posted to the user story
    const response  = await statusService.postStatus(request.token, request.status);

    //take something out of the queue and post it to the followers feeds in a batch write

    
    return {
        success: true,
        message: null,
    }
}