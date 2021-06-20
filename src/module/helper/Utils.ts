export interface ILogger {
    Log: (...args: any) => void;
    LogDebug: (...args: any) => void;
    LogError: (...args: any) => void;
}

export const Logger: ILogger = {
    Log: new function (...args: any) {
        console.log("Bellows | ", ...args);
    },
    LogDebug: new function (...args: any) {
        console.debug("Bellows DBG | ", ...args);
    },
    LogError: new function (...args: any) {
        console.error("Bellows ERR | ", ...args);
    }
}