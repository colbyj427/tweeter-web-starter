export class User {
    firstName;
    lastName;
    alias;
    password;
    imageUrl;

    constructor(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageUrl: string
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.alias = alias;
        this.password = password;
        this.imageUrl = imageUrl;
    }

    toString(): string {
        return (
          "User{" +
          "first_name='" +
          this.firstName +
          "'" +
          ", last_name='" +
          this.lastName +
          "alias='" +
          this.alias +
          "'" +
          ", image_url='" +
          this.imageUrl +
          "}"
        );
      }
}