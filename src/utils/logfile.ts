import * as moment from 'moment';
import * as winston from 'winston';
import {format} from 'winston';

const stringify = require('json-stringify-safe');

const {
    combine,
    simple,
    splat,
    // errors,
    // cli,
    metadata,
} = format;

const addTimeStamp = format((info: any) => {
    info.message =
        moment().format(' YYYY-MM-DD, HH:mm:ss ') + ' : ' + info.message;

    return info;
});

export const logfile = (filePath = 'info', message: string, ...meta: any[]) => {
    const _logger = winston.createLogger({
        // level: 'silly',
        // levels: winston.config.cli.levels,
        format: combine(
            addTimeStamp(),
            splat(),
            simple(),
            metadata(),
            format.printf((info) =>
                Object.keys(info.metadata).length
                    ? `${info.message} | ${stringify(info.metadata, null, 2)}`
                    : `${info.timestamp} | [${info.level}] ${info.message}`,
            ),

            // errors(),
            // formatMetadata()
        ),
        transports: [],
    });

    const trans = [
        // new winston.transports.Console({
        //     format: combine(colorize(), format.cli()),
        // }),

        new winston.transports.File({
            filename: `logs/${filePath}.log`,
        }),
    ];

    trans.forEach((tran) => _logger.add(tran));

    _logger.info(message, meta);
};
