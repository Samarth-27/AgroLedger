import { Router } from 'express';
import { GenericController, GenericService } from '../controllers/GenericController';
import { Model, Document } from 'mongoose';
import { authMiddleware } from '../middlewares/authMiddleware';

export const createGenericRouter = <T extends Document>(model: Model<T>, schema: any, name: string) => {
  const router = Router();
  const service = new GenericService<T>(model, schema, name);
  const controller = new GenericController<T>(service);

  router.use(authMiddleware);
  router.post('/', controller.create);
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};
