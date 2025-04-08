import { PostStatusRequest, StatusDto, TweeterResponse, UserDto } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { StatusDao } from "../../model/Daos/DynamoDbDaos/StatusDynamoDbDao";
import { followerDao } from "../../model/Daos/DynamoDbDaos/FollowerDynamoDbDao";
import { UserDynamoDbDao } from "../../model/Daos/DynamoDbDaos/UserDynamoDbDao";
import { FollowService } from "../../model/service/FollowService";

//the message on the queue is a PostStatusRequest in json format
// export const handler = async (event: any): Promise<TweeterResponse> => {
//     const statusService = new StatusService(new StatusDao, new followerDao, new UserDynamoDbDao);
//     const followService = new FollowService(new followerDao, new UserDynamoDbDao);

//     //parse the event
//     for (const record of event.Records) {
//         try {
//             let messageBody = record.body;
//             const request: PostStatusRequest = JSON.parse(messageBody);
//             //Get a page of followers of the poster
//             //then send that batch to the queue and loop around for more until its done.
//             let hasMorePages = true;
//             let lastItem = null;
//             while (hasMorePages) {
//                 const [page, hasMore] = await followService.loadMoreFollowers(request.token, request.status.user.alias, 20, lastItem);
//                 hasMorePages = hasMore;
//                 lastItem = page.length > 0 ? page[page.length - 1] : lastItem;
//                 console.log("sending page to feed queue", page);
//                 console.log("Last item:", lastItem);
//                 await statusService.sendStatusMessage("https://sqs.us-west-1.amazonaws.com/050451373472/UpdateFeedQueue", JSON.stringify({
//                     users: page,
//                     status: request.status
//                 }));
//             }
//     } catch (err) {
//         console.error("Failed to process record:", record, err);
//     }
//     }
    
    
//     return {
//         success: true,
//         message: null,
//     }
// }

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  export const handler = async (event: any): Promise<TweeterResponse> => {
    const statusService = new StatusService(new StatusDao, new followerDao, new UserDynamoDbDao);
    const followService = new FollowService(new followerDao, new UserDynamoDbDao);
  
    for (const record of event.Records) {
      try {
        const messageBody = record.body;
        const request: PostStatusRequest = JSON.parse(messageBody);
  
        let hasMorePages = true;
        let lastItem = null;
  
        while (hasMorePages) {
          let page: UserDto[] = [];
          let success = false;
          let attempts = 0;
          let delay = 10;
  
          // Retry loop for loadMoreFollowers (throttling-safe)
          while (!success && attempts < 10) {
            try {
              const [resultPage, hasMore] = await followService.loadMoreFollowersBatch(
                request.token,
                request.status.user.alias,
                20,
                lastItem
              );
              page = resultPage;
              hasMorePages = hasMore;
              success = true;
            } catch (err: any) {
              if (err.name === "ProvisionedThroughputExceededException") {
                console.warn(`Throttled on attempt ${attempts + 1}, retrying in ${delay}ms`);
                await sleep(delay);
                if (delay < 1000) {
                  delay += 100;
                }
                attempts++;
              } else {
                throw err; // rethrow unexpected errors
              }
            }
          }
  
          if (!success) {
            throw new Error("Failed to load followers after multiple retries");
          }
  
          lastItem = page.length > 0 ? page[page.length - 1] : lastItem;
  
        //   console.log("sending page to feed queue", page);
        //   console.log("Last item:", lastItem);
  
          await statusService.sendStatusMessage(
            "https://sqs.us-west-1.amazonaws.com/050451373472/UpdateFeedQueue",
            JSON.stringify({
              users: page,
              status: request.status
            })
          );
        }
      } catch (err) {
        console.error("Failed to process record:", record, err);
      }
    }
  
    return {
      success: true,
      message: null,
    };
  };
  