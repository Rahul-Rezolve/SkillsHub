import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "HR" | "EMPLOYEE";
      employeeId: string | null;
    };
  }

  interface User {
    role: "HR" | "EMPLOYEE";
    employeeId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "HR" | "EMPLOYEE";
    employeeId: string | null;
  }
}
