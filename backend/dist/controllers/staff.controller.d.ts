import { Request, Response } from 'express';
declare class StaffController {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getStats(_req: Request, res: Response): Promise<void>;
    getManagers(_req: Request, res: Response): Promise<void>;
}
declare const _default: StaffController;
export default _default;
//# sourceMappingURL=staff.controller.d.ts.map