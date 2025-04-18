import { PagedStatusItemRequest, PagedStatusItemResponse, PostStatusRequest, TweeterResponse } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { StatusDao } from "../../model/Daos/DynamoDbDaos/StatusDynamoDbDao"
import { followerDao } from "../../model/Daos/DynamoDbDaos/FollowerDynamoDbDao";
import { UserDynamoDbDao } from "../../model/Daos/DynamoDbDaos/UserDynamoDbDao";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    const statusService = new StatusService(new StatusDao, new followerDao, new UserDynamoDbDao)
    const [items, hasMore]  = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}