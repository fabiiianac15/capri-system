import { Request, Response } from 'express';
export declare const supplierController: {
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<void>;
    getCountries(req: Request, res: Response): Promise<void>;
    getStates(req: Request, res: Response): Promise<void>;
    getCities(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=supplier.controller.d.ts.map