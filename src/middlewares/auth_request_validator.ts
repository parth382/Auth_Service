import { Request, Response, NextFunction } from 'express';

export const validateUserAuth = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            success: false,
            data: {},
            message: 'Something went wrong',
            err: 'Email or password missing in the request',
        });
        return;
    }

    next();
};
