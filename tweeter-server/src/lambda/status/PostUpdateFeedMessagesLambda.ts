import { PostStatusRequest, StatusDto, TweeterResponse, UserDto } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { StatusDao } from "../../model/Daos/DynamoDbDaos/StatusDynamoDbDao";
import { followerDao } from "../../model/Daos/DynamoDbDaos/FollowerDynamoDbDao";
import { UserDynamoDbDao } from "../../model/Daos/DynamoDbDaos/UserDynamoDbDao";
import { FollowService } from "../../model/service/FollowService";

//the message on the queue is a statusDto in json format
export const handler = async (event: any): Promise<TweeterResponse> => {
    const statusService = new StatusService(new StatusDao, new followerDao, new UserDynamoDbDao);
    const followService = new FollowService(new followerDao, new UserDynamoDbDao);

    //get the json into the right format
    //const request: PostStatusRequest = JSON.parse(event);
    console.log("event", event);

    //parse the event
    for (const record of event.Records) {
        const body = record.body;

        // Convert the body string back into your object
        const req: PostStatusRequest = JSON.parse(body);

        console.log("Post:", req.status.post);
        console.log("User:", req.status.user.alias);
        console.log("Timestamp:", req.status.timestamp);
    }

    //Get all the followers of the poster
    //This would likely be where we call a function that does a batch of 10-20,
    //then send that batch to the queue and loop around for more until its done.
    // let hasMorePages = true;
    // let lastItem = null;
    // let followers: UserDto[] = [];
    // while (hasMorePages) {
    //     const [page, hasMore] = await followService.loadMoreFollowers(request.token, request.status.user.alias, 20, lastItem);
    //     followers = followers.concat(page);
    //     hasMorePages = hasMore;
    //     lastItem = page[page.length - 1];
    //     //send the page to the queue and then get the next page
    //     console.log("sending page to feed queue", page);
    //     //await statusService.sendMessage("https://sqs.us-west-1.amazonaws.com/050451373472/UpdateFeedQueue", JSON.stringify(page));
    //     followers = [];
    // }
    
    return {
        success: true,
        message: null,
    }
}