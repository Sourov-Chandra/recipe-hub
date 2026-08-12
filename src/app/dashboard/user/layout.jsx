import { requireRole } from "@/lib/core/session";

const UserDashboardLayout = async ({ children }) => {
  await requireRole("user");

  return children;
};

export default UserDashboardLayout;
