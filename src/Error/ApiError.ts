class ApiError extends Error{

    public readonly statusCode:number 
    // public readonly stack?: string;
    public readonly success:boolean
    public readonly errors:string[] 
    // public readonly message:string

    constructor(message:string , statusCode:number , success:boolean = false, errors:string[] = []){
        super(message);
        this.statusCode = statusCode
        this.success = success
        this.errors = errors
        // Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export default ApiError