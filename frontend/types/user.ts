interface FullName {
  firstName: string;
  lastName: string;
}
interface User {
  _id: string;
  email: string;
  fullName: FullName;
}


