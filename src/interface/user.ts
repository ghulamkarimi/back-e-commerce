export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isVerifyToken: boolean;
    access_token: string;
    isPasswordMatched: Function;
    randomVerifyToken: string;
}

export interface CustomError extends Error {
    statusCode?: number
}