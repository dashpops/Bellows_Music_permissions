export interface ILogger {
    Log: (...args) => void;
}

export const Logger: ILogger = {
    Log: new function(...args) {
        console.log("Bellows | ", ...args);
    }
}