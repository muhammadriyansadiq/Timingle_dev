export const UserRoles = {
    User: "User",
    Vendor: "Vendor",
    Breeder: "Breeder",
    Admin: "Admin",
    Veterinary: "Veterinary"
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];
