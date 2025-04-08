import { StatusDto, TweeterResponse, UserDto } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { StatusDao } from "../../model/Daos/DynamoDbDaos/StatusDynamoDbDao";
import { followerDao } from "../../model/Daos/DynamoDbDaos/FollowerDynamoDbDao";
import { UserDynamoDbDao } from "../../model/Daos/DynamoDbDaos/UserDynamoDbDao";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function retryPostToFeeds(
    statusService: StatusService,
    users: UserDto[],
    status: StatusDto,
    maxAttempts = 10,
    baseDelay = 10
  ) {
    let attempts = 0;
    let delay = baseDelay;
  
    while (attempts < maxAttempts) {
      try {
        await statusService.postToFeeds(users, status);
        return;
      } catch (err: any) {
        if (err.name === "ProvisionedThroughputExceededException") {
          attempts++;
          console.warn(`Throttled writing to feed (attempt ${attempts}). Retrying in ${delay}ms...`);
          await sleep(delay);
          if (delay < 1000) delay += 100;
        } else {
          throw err;
        }
      }
    }
  
    throw new Error("Failed to post to feeds after multiple retries");
  }
  
  export const handler = async (event: any): Promise<TweeterResponse> => {
    const statusService = new StatusService(new StatusDao, new followerDao, new UserDynamoDbDao);
  
    for (const record of event.Records) {
      try {
        const body = record.body;
        const message = JSON.parse(body);
        const users: UserDto[] = message.users;
        const status: StatusDto = message.status;
  
        //retry-wrapped version of postToFeeds
        await retryPostToFeeds(statusService, users, status);
      } catch (err) {
        console.error("Failed to process feed update for record:", record, err);
      }
    }
  
    return {
      success: true,
      message: null,
    };
  };
  