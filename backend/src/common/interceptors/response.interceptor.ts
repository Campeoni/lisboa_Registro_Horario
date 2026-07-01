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
    const request = context.switchToHttp().getRequest<{ url: string }>();
    const url = request.url;

    // Skip wrapper for auth endpoints (login/register return raw tokens)
    if (url && url.startsWith('/auth/')) {
      return next.handle() as Observable<ApiResponse<T>>;
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
