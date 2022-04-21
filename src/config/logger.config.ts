import * as pinoms from 'pino-multi-stream';
import * as fs from 'fs';
import 'dotenv/config';

export class LoggerConfig {
  private _config;
  constructor() {
    const streams = [
      { stream: process.stdout },
      { stream: fs.createWriteStream('./logs/api.log', { flags: 'a' }) },
    ];

    this._config = {
      pinoHttp: [
        {
          name: '[hero-backend]',
          level: process.env.APP_ENV !== 'production' ? 'debug' : 'info',
          // install 'pino-pretty' package in order to use the following option
          transport:
            process.env.APP_ENV !== 'local'
              ? undefined
              : { target: 'pino-pretty' },
          useLevelLabels: true,
        },
        pinoms.multistream(streams),
      ],
    };
  }

  get config(): any {
    return this._config;
  }
}
