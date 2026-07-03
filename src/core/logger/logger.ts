export class Logger {
    error(message: string, error?: unknown): void {
        console.error(message, error);
    }

    warn(message: string): void {
        console.warn(message);
    }

    info(message: string): void {
        console.info(message);
    }
}

export const logger = new Logger();