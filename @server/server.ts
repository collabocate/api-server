import mongooseConnect from '@server/db.connect';
import { server } from '@server/app';
import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT) || 3000;

server.listen(port, () => {
  mongooseConnect(port);
});

