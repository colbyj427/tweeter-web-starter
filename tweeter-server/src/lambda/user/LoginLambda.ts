import { LoginRegisterResponse, LoginRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { UserDynamoDbDao } from "../../model/Daos/DynamoDbDaos/UserDynamoDbDao";

export const handler = async (request: LoginRequest): Promise<LoginRegisterResponse> => {
    const userService = new UserService(new UserDynamoDbDao)
    const [user, token] = await userService.login(request.alias, request.password);

    return {
        success: true,
        message: null,
        user: user,
        token: token
    }
}