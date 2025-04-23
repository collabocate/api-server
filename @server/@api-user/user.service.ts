import { badRequestErr, notFoundErr } from '@lib/errors/Errors';
import { UserDocument, UserModel as User, UserRole } from '@server/@api-user/user.model';
import { CollabocateInstanceModel as CollabocateInstance } from '@collabocate/instance.model';


export const getAllUsersService = async () => {
  const query = await User.find({role:{$ne: UserRole.Admin}}).populate('instance').exec();
  return query;
};

export const getOneUserService = async (paramsId: string) => {
  const query = await User.findById(paramsId).populate('instance').exec();
  if(!query){
    notFoundErr('No record found for provided ID');
  }
  return query;
};

export const deleteOneUserService = async (paramsId: string) => {
  const user = await User.findOne({ _id: paramsId, role:{$ne: UserRole.Admin} }).exec();
  if(!user){
    notFoundErr('Operation not allowed');
  }
  await CollabocateInstance.deleteMany({ user: user }).exec();
  const query = await User.deleteOne({ _id: paramsId }).exec();
  return query;
}

export const updateOneUserPropertyValueService = async (paramsId: string, requestBody: UserDocument) => {
  if (requestBody.role) {
    badRequestErr('Operation not allowed')
  }

  const query = await User.findById(paramsId).exec();
  if(!query){
    notFoundErr('No record found for provided ID');
  }

  query.set({ ...query, ...requestBody });
  const updatedQuery = await query.save();
  return updatedQuery;
};

export const updateUserPropertyValuesService = async (paramsId: string, requestBody: UserDocument) => {
  if (requestBody.role) {
    badRequestErr('Operation not allowed')
  }

  const query = await User.findById(paramsId).exec();
  if(!query){
    notFoundErr('No record found for provided ID');
  }

  query.password = requestBody.password;

  const updatedQuery = await query.save();
  return updatedQuery;
};

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

//--------------------------------------------------------------------------------------------------//
export const deleteAllUserService = async () => {
  const query = await User.deleteMany({role:{$ne: UserRole.Admin}}).exec();
  return query;
}
//--------------------------------------------------------------------------------------------------//