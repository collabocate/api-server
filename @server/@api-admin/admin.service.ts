import { UserModel as User, UserRole } from '@server/@api-user/user.model';


export const createAdminUserService = async () => {
  let adminUser = await User.findOne({ role: UserRole.Admin }).exec();
  if (!adminUser) {
    const createAdminUser = new User({
      email: "admin@admin.com",
      password: "admin",
      role: UserRole.Admin,
    }); 
    adminUser = await createAdminUser.save();
  }
  return adminUser;
};