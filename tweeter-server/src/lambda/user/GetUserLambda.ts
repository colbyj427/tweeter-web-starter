import { GetUserResponse, TweeterRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { UserDynamoDbDao } from "../../model/Daos/DynamoDbDaos/UserDynamoDbDao";

export const handler = async (request: TweeterRequest): Promise<GetUserResponse> => {
    const userService = new UserService(new UserDynamoDbDao)
    const user  = await userService.getUser(request.token, request.userAlias);

    return {
        success: true,
        message: null,
        user: user
    }
}