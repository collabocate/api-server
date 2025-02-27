import {
  createAdminUserService,
} from './admin.service';
import { error } from '@lib/helpers';

export const createAdminUserController = async () => {
  try {
    await createAdminUserService();
  } catch (err) {
    error(`ERROR: Could not Find or Create An Admin User\n${err.message}`);
  }
}