import { badRequestErr, notFoundErr } from '@lib/errors/Errors';
import { CollabocateInstanceDocument, CollabocateInstanceModel as CollabocateInstance } from '@collabocate/instance.model';


export const createCollabocateInstanceService = async (requestBody: CollabocateInstanceDocument): Promise<CollabocateInstanceDocument> => {
  if (Object.keys(requestBody).includes("global") && requestBody.global === true) {
    const query = await CollabocateInstance.findOne({global: true}).exec();
    if(query){
      badRequestErr('A global setting already exists, Only One Global Setting can exist');
    }
    if (requestBody.instance_name) {
      badRequestErr('global setting does not require <instance_name> property');
    }
  } else {
    if (!requestBody.instance_name) {
      badRequestErr('<instance_name> property is required for non global settings');
    }
  }

  const createCollabocateInstance = new CollabocateInstance({
    global: requestBody.global,
    instance_name: requestBody.instance_name,
    github: {
      user_name: requestBody.github.user_name,
      repo_name: requestBody.github.repo_name
    }
  }); 
  const save = await createCollabocateInstance.save();
  return save;
}

export const getCollabocateInstanceService = async () => {
  const query = await CollabocateInstance.find().sort({'global': -1}).exec();
  return query;
}

export const getOneCollabocateInstanceService = async (paramsId: string) => {
  const query = await CollabocateInstance.findById(paramsId).exec();
  if(!query){
    notFoundErr('No record found for provided ID');
  }
  return query;
}

export const deleteOneCollabocateInstanceService = async (paramsId: string) => {
  const query = await CollabocateInstance.deleteOne({ _id: paramsId }).exec();
  if (query.deletedCount < 1){
    notFoundErr('No record found for provided ID to be deleted');
  }
  return query;
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