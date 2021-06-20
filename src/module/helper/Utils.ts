class Logger {
    Log(...args: any) {
        console.log("Bellows | ", ...args);
    }

    LogDebug(...args: any) {
        console.debug("Bellows DBG | ", ...args);
    }

    LogError(...args: any) {
        console.error("Bellows ERR | ", ...args);
    }
}

export default new Logger();