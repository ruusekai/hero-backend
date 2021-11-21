export class LoggerConfig{
  private _config;
  constructor() {
    this._config = { pinoHttp: [
        {
          name: '[hero-backend]',
          level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
          // install 'pino-pretty' package in order to use the following option
          transport: process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : {},
          useLevelLabels: true,
        },
      ],
    }
  }

    get config(): any{
      return this._config;
    }
}
