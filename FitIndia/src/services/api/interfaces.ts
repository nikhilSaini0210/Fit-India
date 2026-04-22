export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RegisterBody {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ChangePassBody {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
