import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../responses/api-response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | T>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const url = request.url as string;

    // Skip wrapper for auth endpoints (login/register return raw tokens)
    if (url && url.startsWith('/auth/')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return next.handle();
    }

    return next.handle().pipe(
      map((data: unknown) => {
        // If data is already wrapped or null, return as-is
        if (data === null || data === undefined) {
          return data as T;
        }
        // Wrap successful responses
        return new ApiResponse(data as T);
      }),
    );
  }
}
