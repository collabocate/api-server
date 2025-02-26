import { badRequestErr, notFoundErr } from '@lib/errors/Errors';
import { UserDocument, UserModel as User, UserRole } from '@server/@api-user/user.model';


export const getOneUserService = async (paramsId: string) => {
  const query = await User.findById(paramsId).populate('instance').exec();
  if(!query){
    notFoundErr('No record found for provided ID');
  }
  return query;
};

export const updateOneUserService = async (paramsId: string, requestBody: UserDocument) => {
  if (requestBody.role || requestBody.email || requestBody.email_verified) {
    badRequestErr('<role> or <email> or <email_verified> property update no allowed')
  }

  const query = await User.findById(paramsId).exec();
  if(!query){
    notFoundErr('No record found for provided ID');
  }

  query.set({ ...query, ...requestBody });
  const updatedQuery = await query.save();
  return updatedQuery;
};

export const deleteOneUserService = async (paramsId: string) => {
  const query = await User.deleteOne({ _id: paramsId }).exec();
  if (query.deletedCount < 1){
    notFoundErr('No record found for provided ID to be deleted')
  }
  return query;
}

//--------------------------------- ADMIN RELATED SERVICES -------------------------------------//
export const getAllUsersService = async () => {
  const query = await User.find({role:{$ne: UserRole.Admin}}).populate('instance').exec();
  return query;
};

export const deleteAllUserService = async () => {
  const query = await User.deleteMany({role:{$ne: UserRole.Admin}}).exec();
  return query;
}
//--------------------------------------------------------------------------------------------------//