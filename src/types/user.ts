export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  role?: string;
}

export interface UpdateUserByIdRequest {
  gender?: string;
  [key: string]: any;
}

export interface BlockUserRequest {
  email: string;
  isBlocked: boolean;
}

export interface DisableProfileRequest {
  password?: string;
  role?: string;
}

export interface UserListResponse {
  data: {
    users: any[];
    total: number;
    page: number;
    limit: number;
  };
}
