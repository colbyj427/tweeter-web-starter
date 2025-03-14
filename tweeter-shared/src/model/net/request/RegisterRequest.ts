import { LoginRequest } from "./LoginRequest";

export interface RegisterRequest extends LoginRequest {
    readonly firstName: string,
    readonly lastName: string,
    readonly alias: string,
    readonly password: string,
    readonly imageBytes: string,
    readonly imageFileExtension: string
}