import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { ChangeEvent } from "react";
import { Buffer } from "buffer";

export interface RegisterView {
    displayErrorMessage: (message: string) => void,
    updateUserInfo: (
            currentUser: User,
            displayedUser: User | null,
            authToken: AuthToken,
            remember: boolean
          ) => void,
    navigate: (url: string) => void;
    updateImageUrl: (imageUrl: string) => void;
    updateFileExtension: (fileExtension: string) => void;
}

export class RegisterPresenter {
    private userService: UserService;
    private view: RegisterView;
    private _isLoading: boolean = false;
    private imageUrl: string = ""
    private imageBytes: Uint8Array = new Uint8Array()
    private imageFileExtension: string = ""

    public constructor(view: RegisterView) {
            this.view = view;
            this.userService = new UserService();
        }

    public async doRegister (firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean) {
        try {
          this._isLoading = true
    
          const [user, authToken] = await this.userService.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension
          );
    
          this.view.updateUserInfo(user, user, authToken, rememberMe);
          this.view.navigate("/");
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to register user because of exception: ${error}`
          );
        } finally {
          this._isLoading = false
        }
      };

    public handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        this.handleImageFile(file);
      };

    public handleImageFile = (file: File | undefined) => {
        if (file) {
          this.imageUrl = URL.createObjectURL(file)
          this.view.updateImageUrl(this.imageUrl);
    
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const imageStringBase64 = event.target?.result as string;
    
            // Remove unnecessary file metadata from the start of the string.
            const imageStringBase64BufferContents =
              imageStringBase64.split("base64,")[1];
    
            const bytes: Uint8Array = Buffer.from(
              imageStringBase64BufferContents,
              "base64"
            );
    
            this.imageBytes = bytes
          };
          reader.readAsDataURL(file);
    
          // Set image file extension (and move to a separate method)
          const fileExtension = this.getFileExtension(file);
          if (fileExtension) {
            this.imageFileExtension = fileExtension
            this.view.updateFileExtension(this.imageFileExtension)
          }
        } else {
          this.imageUrl = ""
          this.imageBytes = new Uint8Array()
        }
      };

      public getFileExtension = (file: File): string | undefined => {
        return file.name.split(".").pop();
      };


}