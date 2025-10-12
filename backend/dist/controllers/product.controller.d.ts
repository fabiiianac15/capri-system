import { Request, Response } from 'express';
export declare const productController: {
    getAll(_req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    createOutput(req: Request, res: Response): Promise<void>;
    getOutputs(req: Request, res: Response): Promise<void>;
    getLowStock(_req: Request, res: Response): Promise<void>;
    getStats(_req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=product.controller.d.ts.map