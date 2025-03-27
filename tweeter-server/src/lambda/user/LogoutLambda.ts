import { TweeterRequest, TweeterResponse } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { UserDynamoDbDao } from "../../model/Daos/DynamoDbDaos/UserDynamoDbDao";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {
    const userService = new UserService(new UserDynamoDbDao)
    await userService.logout(request.token);

    return {
        success: true,
        message: null,
    }
}