export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    verify_token: boolean;
    access_token: boolean;
    isPasswordMatch: Function

}