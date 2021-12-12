export class ResponseStatus {
  private readonly code: number;
  private readonly systemMessage: string;
  private readonly displayMessage: string;

  constructor(_code: number, _systemMessage: string, _displayMessage: string) {
    this.code = _code;
    this.systemMessage = _systemMessage;
    this.displayMessage = _displayMessage;
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
}
