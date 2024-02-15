export class Result<T> {
    isSuccess: boolean = false;
    value?: T;

    constructor(isSuccess: boolean = false, value?: T) {
        this.isSuccess = isSuccess;
        this.value = value;
    }
}