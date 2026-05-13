// Generic success response
export class ApiResponse<T> {
  success: true;
  data: T;
  message?: string;

  constructor(data: T, message?: string) {
    this.success = true;
    this.data = data;
    this.message = message;
  }
}

// Error response
export class ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };

  constructor(code: string, message: string) {
    this.success = false;
    this.error = { code, message };
  }
}
