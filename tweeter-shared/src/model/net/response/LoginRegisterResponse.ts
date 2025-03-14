import { UserDto } from "../../dto/UserDto";
import { GetUserResponse } from "./GetUserResponse";

export interface LoginRegisterResponse extends GetUserResponse {
    readonly user: UserDto | null
    readonly token: string | null
}