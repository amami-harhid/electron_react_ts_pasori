import logger from 'electron-log';
import { ApConfig } from '../conf/conf';

const DEBUG_LOG = "DEBUG_LOG";
export interface ILogger {
    info: CallableFunction;
    debug: CallableFunction;
    warn: CallableFunction;
    error: CallableFunction;
}
export class Logger implements ILogger {
    info(...args: any[]) {
        logger.info(args);
    }
    debug(...args: any[]) {
        if(ApConfig.has(DEBUG_LOG) && ApConfig.get(DEBUG_LOG)===true){
            logger.debug(args);
        }
    }
    warn(...args: any[]) {
        logger.warn(args);
    }
    error(...args: any[]) {
        logger.error(args);
    }
}