import express, { Router } from 'express';
//import v1ApiRoutes from './v1index';
import { createUserController, isAdminController, isAuthenticatedController, signInUserController } from '../../controllers/user-controller';
import { validateUserAuth } from '../../middlewares/auth_request_validator';

export const createV1Router = (): Router => {
    const v1router = express.Router();
    
    // Mount v1 API routes
    v1router.post('/signup',validateUserAuth, createUserController as any);
    v1router.post('/signin' ,validateUserAuth, signInUserController as any);
    v1router.get('/isAuthenticated',isAuthenticatedController as any);
    v1router.get('/isAdmin',isAdminController as any);


    return v1router;
};