import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface GetCountRequest extends TweeterRequest {
    readonly user: UserDto
}