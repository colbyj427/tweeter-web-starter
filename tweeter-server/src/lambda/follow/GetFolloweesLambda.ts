import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared"
import { FollowService } from "../../model/service/FollowService"
import { followerDao } from "../../model/Daos/DynamoDbDaos/FollowerDynamoDbDao"
import { UserDynamoDbDao } from "../../model/Daos/DynamoDbDaos/UserDynamoDbDao";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    const followService = new FollowService(new followerDao, new UserDynamoDbDao);
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}