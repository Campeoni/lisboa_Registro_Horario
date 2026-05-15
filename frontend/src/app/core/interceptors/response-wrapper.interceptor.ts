import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const responseWrapperInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.body) {
        // Check if it's our API response wrapper
        if (Object.prototype.hasOwnProperty.call(event.body, 'success')) {
          const wrapper = event.body as {
            success: boolean;
            data?: unknown;
            error?: { code: string; message: string };
          };

          // If error response, throw for handling
          if (!wrapper.success && wrapper.error) {
            throw new Error(wrapper.error.message);
          }

          // Extract data from wrapper
          return event.clone({ body: wrapper.data });
        }
      }
      return event;
    })
  );
};