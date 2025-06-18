import { Request, Response } from 'express';
import { User } from '../model/User'; // TypeORM Entity
import { createUserService, isAdminService, isAuthenticatedService, signInUserService } from '../services/user-service';
import AppDataSource from '../config/dataSource';
import jwt from 'jsonwebtoken';
import { createUserRepository, UserRepository } from '../repository/user-repository';

export interface CreateUserDTO {
  email: string;
  password: string;
}


// Controller: Create User
export const createUserController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password }: CreateUserDTO = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        data: {},
        err: {
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined,
        },
      });
    }

    const user: User = await createUserService({ email, password });

    return res.status(201).json({
      success: true,
      message: 'Successfully created a new user',
      data: user,
      err: {},
    });
  } catch (error: any) {
    console.error('Create User Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      data: {},
      err: error?.message || error,
    });
  }
};

// Controller: Sign In User
export const signInUserController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password }: CreateUserDTO = req.body;

    const response = await signInUserService(email, password);

    return res.status(200).json({
      success: true,
      message: 'Successfully signed in',
      data: response,
      err: {},
    });
  } catch (error: any) {
    console.error('Sign In Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      data: {},
      err: error?.message || error,
    });
  }
};

export const isAuthenticatedController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const token = req.headers['x-access-token'] as string;

        if (!token) {
            return res.status(401).json({
                success: false,
                data: {},
                message: 'Token missing in headers',
                err: 'Unauthorized',
            });
        }

        // dont need to decode in controller
        // const decoded = jwt.verify(token, process.env.JWT_KEY as string) as { id: number };

        const user:User | null = await isAuthenticatedService(token);


        if (!user) {
            return res.status(401).json({
                success: false,
                data: {},
                message: 'Invalid token: user not found',
                err: 'Unauthorized',
            });
        }

        return res.status(200).json({
            success: true,
            err: {},
            data: {
                id: user.id,
                email: user.email,
            },
            message: 'User is authenticated and token is valid',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            data: {},
            message: 'Something went wrong',
            err: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const isAdminController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.body.id;

    // if (!userId || typeof userId !== 'number') {
    //   return res.status(400).json({
    //     message: 'Invalid user ID',
    //     data: {},
    //     success: false,
    //     err: { message: 'User ID must be a number' }
    //   });
    // }

    // Create repository instance using your data source
    const userRepository: UserRepository = createUserRepository(AppDataSource);

    // Call service function
    const response = await isAdminService(userId);

    return res.status(200).json({
      data: response,
      err: {},
      success: true,
      message: 'Successfully fetched whether user is admin or not'
    });
  } catch (error) {
    console.error('Error in isAdmin controller:', error);

    return res.status(500).json({
      message: 'Something went wrong',
      data: {},
      success: false,
      err: error instanceof Error ? error.message : error
    });
  }
};