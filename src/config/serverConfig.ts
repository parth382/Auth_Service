import dotenv from 'dotenv';
import bcrypt from 'bcrypt';


dotenv.config();

export interface ServerConfig {
    //PORT: string | undefined;
    SALT: string | number;
    JWT_KEY: string | undefined;
    
}

export const config: ServerConfig = {
    //PORT: process.env.PORT,
    SALT: bcrypt.genSaltSync(10), // Default salt rounds if not provided  
    // NOTE : don't try to keep salt in .env file it does not configure salt from env file
    // SALT is additional data that you put in your hash function
    JWT_KEY: process.env.JWT_KEY,
    
};

export const {  JWT_KEY, SALT } = config;