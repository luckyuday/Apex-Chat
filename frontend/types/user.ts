interface FullName {
  firstName: string;
  lastName: string;
}
export interface UserForm {
  email: string;
  fullName: FullName;
  password: string;
  confirmPassword: string;
}
