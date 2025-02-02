import express, { IRouter } from 'express';
import {
  createCollabocateInstanceController,
  getCollabocateInstanceController,
  getOneCollabocateInstanceController,
  updateOneCollabocateInstanceController,
  deleteOneCollabocateInstanceController,
} from '@collabocate/instance.controller';

const router: IRouter = express.Router();

router.get('/', getCollabocateInstanceController);
router.post('/', createCollabocateInstanceController);
router.get('/:settingID', getOneCollabocateInstanceController);
router.patch('/:settingID', updateOneCollabocateInstanceController);
router.delete('/:settingID', deleteOneCollabocateInstanceController);

export { router };
