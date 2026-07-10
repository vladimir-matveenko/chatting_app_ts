import type { Response } from "express";

export abstract class BaseController {
  protected ok<T>(res: Response<T>, body: T): void {
    res.json(body);
  }

  protected created<T>(res: Response<T>, body: T): void {
    res.status(201).json(body);
  }

  protected noContent(res: Response): void {
    res.status(204).send();
  }
}
