import { notFoundErr } from '@lib/errors/Errors';
import { TrashModel as Trash } from '@trash/trash.model';
// import { CollabocateInstanceModel as CollabocateInstance } from '@collabocate/instance.model';
import { UserModel as User } from '@user/user.model';
import mongoose from 'mongoose';

export const restoreOneTrashService = async (user_id: string, paramsId: string) => {
  const user = await User.findById(user_id).exec();
  if(!user){
    notFoundErr('No record found for provided User ID');
  }

  const trash = await Trash.findById(paramsId);
  if(!trash){
    notFoundErr('No record found for provided Trash ID to be restored');
  }

  const Model = mongoose.models[trash.collectionName]; // Get the original model dynamically

  if (!Model) {
    notFoundErr(`No record found for provided ${trash.collectionName} ID to be deleted`)
  }

  // Restore the document to the original collection
  await Model.create(trash.deletedDocument);

  const query = await Trash.deleteOne({ _id: paramsId }).exec();
  return query;
};

export const getTrashService = async (user_id: string) => {
  const query = await Trash.find({user:{_id: user_id}}).sort({'global': -1}).exec();
  return query;
}

export const getOneTrashService = async (user_id: string, paramsId: string) => {
  const query = await Trash.findOne({ _id: paramsId, user: user_id }).exec();
  if(!query){
    notFoundErr('No record found for provided ID');
  }
  return query;
}

export const getOneSpecificTrashService = async (user_id: string, paramsId: string, collection_name: string) => {
  const query = await Trash.findOne({ _id: paramsId, user: user_id, collectionName: collection_name }).exec();
  if(!query){
    notFoundErr(`No record found for provided ${collection_name} ID to be deleted`);
  }
  return query;
}