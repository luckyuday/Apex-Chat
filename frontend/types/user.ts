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

export interface loginForm {
  email: string;
  password: string;
}

interface uiState {
  token: string;
  chatId: string;
}
