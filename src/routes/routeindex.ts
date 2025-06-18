import express, { Router } from 'express';
import { createV1Router } from './v1/v1index';

const createRouter = (): Router => {
    const router = express.Router();
    
    // Mount v1 API routes
    router.use('/v1', createV1Router());

    return router;
};

export default createRouter();