export class ApiError extends Error {
    statusCode: number;
    errorCode: string | undefined;

    constructor(statusCode: number, errorMessage: string, errorCode?: string) {
        super(errorMessage);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}
