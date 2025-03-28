export class StatusEntity {
    user_handle: string;
    status: string;
    timestamp: number;
  
    constructor(
      user_handle: string,
      status: string,
      timestamp: number,
    ) {
      this.user_handle = user_handle;
      this.status = status;
      this.timestamp = timestamp;
    }
  
    toString(): string {
      return (
        "User{" +
        "user_handle='" +
        this.user_handle +
        "'" +
        ", status='" +
        this.status +
        "}"
      );
    }
  }