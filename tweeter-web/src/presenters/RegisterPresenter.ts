import { ChangeEvent } from "react";
import { Buffer } from "buffer";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";
import { AuthToken, User } from "tweeter-shared";

export interface RegisterView extends AuthenticationView{
  updateImageUrl: (imageUrl: string) => void;
  updateFileExtension: (fileExtension: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter {
  private imageUrl: string = ""
  private imageBytes: Uint8Array = new Uint8Array()
  private imageFileExtension: string = ""

  public constructor(view: RegisterView) {
    super(view)
  }

  protected get view (): RegisterView {
    return super.view as RegisterView;
  }

  protected doAuthentication(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean): Promise<[User, AuthToken]> {
      console.log("imageBytes:");
      console.log(this.imageBytes);
      console.log("image file extension:");
      console.log(imageFileExtension);
      return this.service.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        imageFileExtension
      );
  }

  protected doNavigation(url: string | undefined): void {
    this.view.navigate("/");
  }

  protected getItemDescription(): string {
    return "register user";
  }

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