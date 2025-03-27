import { PostStatusRequest, TweeterResponse } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { StatusDao } from "../../model/Daos/DynamoDbDaos/StatusDynamoDbDao";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
    const statusService = new StatusService(new StatusDao)
    const response  = await statusService.postStatus(request.token, request.status);

    return {
        success: true,
        message: null,
    }
}