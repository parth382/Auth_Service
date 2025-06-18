import { Repository, DataSource } from "typeorm";
import { User } from "../model/User";
import { createValidationError } from "../utils/validation-error";
import AppDataSource from "../config/dataSource";
import { Roles } from "../model/Roles";

export type UserRepository = {
    create: (data: Partial<User>) => Promise<User>;
    destroy: (userId: number) => Promise<boolean>;
    getById : (userId: number) => Promise<Pick<User, "id" | "email"> | null>;
    getByEmail: (userEmail: string) => Promise<User | null>;
    isAdminRepo: (userId: number) => Promise<boolean>; 
};

export const createUserRepository = (dataSource: DataSource): UserRepository => {
    const repository: Repository<User> = dataSource.getRepository(User);

    const create = async (data: Partial<User>): Promise<User> => {
        try {
            const user = repository.create(data);
            return await repository.save(user);
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'QueryFailedError') {
                    throw createValidationError({
                        name: error.name,
                        errors: [{ message: error.message }]
                    });
                }
            }
            console.log("Something went wrong in repository layer");
            throw error;
        }
    };

    const destroy = async (userId: number): Promise<boolean> => {
        try {
            const result = await repository.softDelete(userId);
            return result.affected ? true : false;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error;
        }
    };

    const getById = async (userId: number): Promise<Pick<User, 'id' | 'email'> | null> => {
  try {
    const user = await repository.findOne({
      where: { id: userId },
      select: ['id', 'email'],
    });

    return user ? { id: user.id, email: user.email } : null;
  } catch (error) {
    console.log('Something went wrong in repository layer');
    throw error;
  }
};

// when user try to login with email so we require to get user by email to check is user exist or not
    const getByEmail = async (userEmail: string): Promise<User | null> => {
  try {
    const user = await repository.findOne({
      where: { email: userEmail },
    });

    return user;
  } catch (error) {
    console.error('Something went wrong on repository layer');
    throw error;
  }
};

    const isAdminRepo = async (userId: number): Promise<boolean> => {
  try {
    // const userRepository = AppDataSource.getRepository(User);
    // const roleRepository = AppDataSource.getRepository(Roles);

    const user = await repository.findOne({
      where: { id: userId },
      relations: ['roles'], // Make sure roles are loaded
    });

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const isAdminRole = user.roles.some(role => role.name.toUpperCase() === 'ADMIN');
    return isAdminRole;
  } catch (error) {
    console.error("Something went wrong in the repository layer:", error);
    throw error;
  }
};

    return {
        create,
        destroy,
        getById,
        getByEmail,
        isAdminRepo
    };
};