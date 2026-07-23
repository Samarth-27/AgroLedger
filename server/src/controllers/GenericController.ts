import { Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';
import { BaseRepository } from '../repositories/BaseRepository';
import { AppError } from '../utils/AppError';

export class GenericRepository<T extends Document> extends BaseRepository<T> {
  constructor(model: Model<T>) {
    super(model);
  }
}

export class GenericService<T extends Document> {
  private repo: GenericRepository<T>;
  constructor(model: Model<T>, private schema: any, private name: string) {
    this.repo = new GenericRepository<T>(model);
  }

  async create(data: unknown) {
    const parsedData = this.schema.parse(data);
    return await this.repo.create(parsedData);
  }

  async getAll() {
    return await this.repo.find();
  }

  async getById(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new AppError(`${this.name} not found`, 404);
    return item;
  }

  async update(id: string, data: Partial<any>) {
    // We can add partial validation here if needed
    const item = await this.repo.update(id, data);
    if (!item) throw new AppError(`${this.name} not found`, 404);
    return item;
  }

  async delete(id: string) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new AppError(`${this.name} not found`, 404);
    return true;
  }
}

export class GenericController<T extends Document> {
  constructor(private service: GenericService<T>) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAll();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getById(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id);
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
      next(err);
    }
  };
}
