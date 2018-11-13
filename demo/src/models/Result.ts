export function fail<T>(message: string) {
    return new Result<T>(undefined, message);
}
export function success<T>(data: T) {
    return new Result<T>(data, undefined);
}

export class Result<T> {
    public data: T | undefined;
    public error: string | undefined;

    constructor(data: T | undefined, message: string | undefined) {
        this.error = message;
        this.data = data;
    }

    public isSuccessful() {
        return this.error !== undefined;
    }
    public isFailing() {
        return this.error === undefined;
    }
}
