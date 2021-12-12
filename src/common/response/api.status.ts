import { ResponseStatus } from './response.status';
import { ResponseCode } from './response.code';

export class ApiStatus {
  private readonly code: number;
  private readonly systemMessage: string;
  private readonly displayMessage: string;
  private readonly t: Date;

  constructor(rspStatus: ResponseStatus) {
    if (rspStatus != null) {
      this.code = rspStatus.getCode;
      this.systemMessage = rspStatus.getSystemMessage;
      this.displayMessage = rspStatus.getDisplayMessage;
    } else {
      this.code = ResponseCode.STATUS_1000_SUCCESS.getCode;
      this.systemMessage = ResponseCode.STATUS_1000_SUCCESS.getSystemMessage;
      this.displayMessage = ResponseCode.STATUS_1000_SUCCESS.getDisplayMessage;
    }
    this.t = new Date(Date.now());
  }

  get getCode(): number {
    return this.code;
  }

  get getSystemMessage(): string {
    return this.systemMessage;
  }

  get getDisplayMessage(): string {
    return this.displayMessage;
  }

  get getT(): Date {
    return this.t;
  }
}
