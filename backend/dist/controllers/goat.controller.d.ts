import { Request, Response } from 'express';
declare class GoatController {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    getByCustomId(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getStats(req: Request, res: Response): Promise<void>;
    updateCategoryByWeight(req: Request, res: Response): Promise<void>;
}
declare const _default: GoatController;
export default _default;
//# sourceMappingURL=goat.controller.d.ts.map