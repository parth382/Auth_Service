import { StatusCodes } from 'http-status-codes';
import { createAppError } from './error-handler';

export interface ValidationErrorProps {
    name: string;
    errors: Array<{ message: string }>;
}

export const createValidationError = (error: ValidationErrorProps): Error => {
    const explanation = error.errors.map(err => err.message);
    
    return createAppError({
        name: error.name,
        message: 'Not able to validate the data sent in the request',
        explanation: explanation.join(', '),
        statusCode: StatusCodes.BAD_REQUEST
    });
};