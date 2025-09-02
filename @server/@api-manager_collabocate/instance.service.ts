import { badRequestErr, notFoundErr } from '@lib/errors/Errors';
import {
  CollabocateInstanceDocument,
  CollabocateInstanceModel as CollabocateInstance,
  collectionName as collabocateCollectionName
} from '@collabocate/instance.model';
import { UserModel as User } from '@server/@api-user/user.model';
import { EXPIRATION_IN_SEC, TrashModel as Trash } from '@trash/trash.model';
import mongoose from 'mongoose';


export const createCollabocateInstanceService = async (user_id: string, requestBody: CollabocateInstanceDocument): Promise<CollabocateInstanceDocument> => {
  const user = await User.findById(user_id).exec();
  if(!user){
    notFoundErr('No record found for provided ID');
  }
  
  const instances = await CollabocateInstance.find({ user: user }).exec(); 
  if (instances.length === 0) { // if it is the first instance being created, the instance must be global
    if (!Object.keys(requestBody).includes("global") || !requestBody.global === true || requestBody.instance_name) {
      badRequestErr('First instance must have global: true and no <instance_name> property'); 
    }
  } else { // if it is not the first instance being created, the instance must not be global
    if (requestBody.global === true || !requestBody.instance_name) {
      badRequestErr('A global instance already exists or no <instance_name> property for non global instance'); 
    }
  }

  const createCollabocateInstance = new CollabocateInstance({
    global: requestBody.global,
    instance_name: requestBody.instance_name,
    github_user_name: requestBody.github_username,
    github_repo_name: requestBody.github_reponame,
    user: user
  });

  const savedInstance = await createCollabocateInstance.save();
  
  user.instance.push(savedInstance)
  await user.save()
  
  return savedInstance;
}

export const getAllCollabocateInstanceService = async () => {
  const query = await CollabocateInstance.find().sort({'global': -1}).exec();
  return query;
}

export const getCollabocateInstanceService = async (user_id: string) => {
  const query = await CollabocateInstance.find({user:{_id: user_id}}).sort({'global': -1}).exec();
  return query;
}

export const getOneCollabocateInstanceService = async (user_id: string, paramsId: string) => {
  const query = await CollabocateInstance.findOne({ _id: paramsId, user: user_id }).exec();
  if(!query){
    notFoundErr('No record found for provided ID');
  }
  return query;
}

export const deleteOneCollabocateInstanceService = async (user_id: string, paramsId: string) => {
  const user = await User.findById(user_id).exec();
  if(!user){
    notFoundErr('No record found for provided User ID');
  }

  const collectionName = collabocateCollectionName;
  const Model = mongoose.models[collectionName]; // Dynamically get the Mongoose model

  if (!Model) {
    notFoundErr(`No record found for provided ${collectionName} ID to be trashed`)
  }
  const model = await Model.findById(paramsId).exec()

  // move document to trash before deleting
  const trashedAt = new Date();
  const toBeDeletedAt = new Date(trashedAt.getTime() + EXPIRATION_IN_SEC * 1000);

  const createTrash = await Trash.create({
    collectionName: collectionName,
    trashedDocument: model.toObject(),
    trashedAt,
    toBeDeletedAt,
    user: user
  })

  await Model.deleteOne({ _id: paramsId }).exec();
  
  const trashDoc = await createTrash.save();
  return trashDoc;
}

export const updateOneCollabocateInstanceService = async (paramsId: string, requestBody: CollabocateInstanceDocument) => {
  const query = await CollabocateInstance.findById(paramsId).exec();
  if(!query){
    notFoundErr('No record found for provided ID');
  }
  if (Object.keys(requestBody).includes("global")) {
    badRequestErr('the global property update not allowed');
  }
  if (query.global === true && requestBody.instance_name) {
    badRequestErr('global setting does not require app_name property');
  }

  query.set({ ...query, ...requestBody });
  const updatedQuery = await query.save();
  return updatedQuery;
};