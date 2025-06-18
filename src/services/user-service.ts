import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from "../model/User";
import { createUserRepository, UserRepository , } from "../repository/user-repository";
import { createAppError } from "../utils/error-handler";
import { ValidationError } from "class-validator";
import AppDataSource from "../config/dataSource";
import { JWT_KEY } from '../config/serverConfig';
import { Repository } from 'typeorm';

interface JwtPayload {
  id: number;
  // username: string;
  email: string;
}

// Interface for the JWT payload
interface TokenResponse extends JwtPayload {
  id: number;
  username: string;
  email: string;
}

export async function createUserService(data: Partial<User>): Promise<User> {
  try {
    const userRepository = createUserRepository(AppDataSource);
    const user = await userRepository.create(data);
    return user;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw createAppError({
        name: "ValidationError",
        message: "Validation failed for the provided data",
        explanation: error.constraints ? Object.values(error.constraints).join(', ') : 'Validation failed',
        statusCode: 400
      });
    }

    console.error("Something went wrong in the service layer:", error);
    throw createAppError({
      name: "InternalServerError",
      message: "An unexpected error occurred",
      explanation: error instanceof Error ? error.message : 'Unknown error occurred',
      statusCode: 500
    });
  }
}

// we write business logic for token, direct here, because they dont need to interact with database so we write it in service layer

// Function to create a token
export function createToken(user: User): string {
  try {
      const payload: JwtPayload = {
          id: user.id,
          email: user.email,
      };

      const token = jwt.sign(payload, JWT_KEY as string, { expiresIn: '1d' });
      return token;
  } catch (error) {
      console.error("Something went wrong in token creation:", error);
      throw error;
  }
}

// Function to verify the token
export function verifyToken(token: string): TokenResponse {
  try {
      const response = jwt.verify(token, process.env.JWT_KEY as string) as TokenResponse;
      return response;
  } catch (error) {
      console.error("Something went wrong in token validation:", error);
      throw new Error('Invalid token');
  }
}

// we get encryptedPassword from the repository layer not from database so we dont need to write this logic into the repository layer directly we write it in the service layer
export const checkPassword = (userInputPlainPassword: string,encryptedPassword: string): boolean => {
  try {
    return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
  } catch (error) {
    console.error("Something went wrong in password comparison");
    throw error;
  }
};

export const signInUserService = async (email: string, plainPassword: string): Promise<{token:string,user:{id:number,email:string,password:string}}> => {
  try {
    // ✅ Step 1: Get repository instance properly
    const userRepository = createUserRepository(AppDataSource);

    // ✅ Step 2: Call your repository's getByEmail() method (not findOne directly)
    const user = await userRepository.getByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    // ✅ Step 3: Compare passwords
    const passwordsMatch = checkPassword(plainPassword, user.password);

    if (!passwordsMatch) {
      console.log("Password doesn't match");
      throw new Error('Incorrect password');
    }

    // ✅ Step 4: Create token using full User object
    const token = createToken(user);
    return {token:token,user:user};

  } catch (error) {
    console.error("Something went wrong in the sign-in process:", error);
    throw error;
  }
};

export const isAuthenticatedService = async (token: string): Promise<User> => {
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;

        if (!decoded || !decoded.id) {
            throw new Error('Invalid token');
        }

        // Get user from DB
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: decoded.id });

        if (!user) {
            throw new Error('No user with the corresponding token exists');
        }

        return user;
    } catch (error) {
        console.error('Something went wrong in the auth process');
        throw error;
    }
};

export const isAdminService = async (userId: number): Promise<boolean> => {
    try {
        const userRepository = createUserRepository(AppDataSource);

        return await userRepository.isAdminRepo(userId);
    } catch (error) {
        console.error("Something went wrong in service layer:", error);
        throw error;
    }
};


