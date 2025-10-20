import { Request, Response } from 'express';
declare class SaleController {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getStats(_req: Request, res: Response): Promise<void>;
}
declare const _default: SaleController;
export default _default;
//# sourceMappingURL=sale.controller.d.ts.map