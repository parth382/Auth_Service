import { StatusCodes } from 'http-status-codes';

export interface AppErrorProps {
    name?: string;
    message?: string;
    explanation?: string;
    statusCode?: number;
}

export const createAppError = ({
    name = 'AppError',
    message = 'Something went wrong',
    explanation = 'Something went wrong',
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
}: AppErrorProps = {}): Error & AppErrorProps => {
    const error = new Error(message) as Error & AppErrorProps;
    error.name = name;
    error.explanation = explanation;
    error.statusCode = statusCode;
    return error;
};