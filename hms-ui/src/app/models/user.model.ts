export interface User {
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  role: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface ChangePasswordDTO {
  username: string;
  currentPassword: string;
  newPassword: string;
}

export interface RegisterDTO {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string;
  role: string;
}

export interface UpdateUserDTO {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}
