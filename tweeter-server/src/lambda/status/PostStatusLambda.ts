import { PostStatusRequest, TweeterResponse } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { StatusDao } from "../../model/Daos/DynamoDbDaos/StatusDynamoDbDao";
import { followerDao } from "../../model/Daos/DynamoDbDaos/FollowerDynamoDbDao";
import { UserDynamoDbDao } from "../../model/Daos/DynamoDbDaos/UserDynamoDbDao";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
    const statusService = new StatusService(new StatusDao, new followerDao, new UserDynamoDbDao);
    //send the post to be posted to the user story
    const response  = await statusService.postStatus(request.token, request.status);
    const response2 = await statusService.sendStatusMessage("https://sqs.us-west-1.amazonaws.com/050451373472/PostStatusQueue", JSON.stringify(request));
    
    return {
        success: true,
        message: null,
    }
}