export type Role = "admin" | "user" | "superadmin";

export interface userType {
  id: string;
  email: string;
  role: Role;
  password: string;
  confirm_password: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  status: "active" | "disactive";
  created_at: Date;
  updated_at: Date;
}

export interface tokenData {
  id: string;
  email: string;
  role: string;
}
