import { NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserDTO } from 'src/users/dtos/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run something before a request is handede by the request handler (middleware)
    console.log('Iam running before the hander ', context);

    return handler.handle().pipe(
      map((data: any) => {
        // run something bwfore a response is sent out
        console.log('Iam running bwfore response is sent out', data);
        return plainToClass(UserDTO, data, {
          excludeExtraneousValues: true, // this will ensure that only the properties decorated with @Expose() are included in the serialized output
        });
      }),
    );
  }
}
