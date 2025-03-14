import { UserDto } from "../../dto/UserDto";
import { LoginRequest } from "./LoginRequest";

export interface RegisterRequest extends LoginRequest {
    readonly user: UserDto
}