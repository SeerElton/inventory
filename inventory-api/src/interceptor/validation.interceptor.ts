import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, map, tap } from "rxjs";

@Injectable()
@Injectable()
export class DataValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        // const bodyClassType = Object.getPrototypeOf(request.body).constructor.name;
        // console.log(bodyClassType);

        const data = request.body; // Assuming the data is in the request body


        // Add your data validation logic here
        if (!data.name || !data.email) {
            // throw new Error('Invalid data. Name and email are required.');
        }

        // If data is valid, continue to the controller
        return next.handle().pipe(
            map((response) => {
                // You can also modify the response here if needed
                return response;
            }),
        );
    }
}