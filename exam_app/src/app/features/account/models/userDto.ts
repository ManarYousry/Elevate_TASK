

export interface UserResponse {
    status: boolean,
    code: number,
    payload: UserProfile
}
export interface UserProfile {
  user: User
}

export interface User {
  id: string
  username: string
  email: string
  phone: string
  firstName: string
  lastName: string
  profilePhoto: string
  emailVerified: boolean
  phoneVerified: boolean
  role: string
  createdAt: string
  updatedAt: string
}

export interface UserUpdate{
 firstName?: string
  lastName?: string
  profilePhoto?: string
  phone?: string
}

export interface changeEmailResponse {
  message: string
  code: string
}

export interface confirmEmailChangeResponse{
    message: string
  user: User
}

export interface changePasswordModel {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
