class ApiResponse{
    public readonly message:string
    public readonly statusCode:number
    public readonly data:any 

    constructor(message:string , statusCode:number , data:any = {}){
        this.message = message,
        this.data = data 
        this.statusCode=statusCode
    }
}

export default ApiResponse