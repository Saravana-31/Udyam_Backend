import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../types";
export declare const errorHandler: (err: any, req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const rateLimiter: (maxRequests?: number, windowMs?: number) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const corsOptions: {
    origin: string | string[];
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
};
//# sourceMappingURL=index.d.ts.map