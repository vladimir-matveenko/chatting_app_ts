export class Logger {
    info(message: string, ...args: unknown[]): void {
        console.info(message, ...args);
    }

    warn(message: string, ...args: unknown[]): void {
        console.warn(message, ...args);
    }

    error(message: string, ...args: unknown[]): void {
        console.error(message, ...args);
    }
}

export const logger = new Logger();