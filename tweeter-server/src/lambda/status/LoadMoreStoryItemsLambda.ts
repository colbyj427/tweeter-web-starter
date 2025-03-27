import { PagedStatusItemRequest, PagedStatusItemResponse, PostStatusRequest, TweeterResponse } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { StatusDao } from "../../model/Daos/DynamoDbDaos/StatusDynamoDbDao";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    const statusService = new StatusService(new StatusDao)
    const [items, hasMore]  = await statusService.loadMoreStoryItems(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}