interface UserData {
    id: number;
    email: string;
    first_name: string;
    surname: string;

}

type LoginAuthData = {
    email?: string;
    password?: string;
    otp?: string;
    jwt?: string;
    method?: string;
}

export type { UserData, LoginAuthData };

export interface LoginResponse {
    mfa?: boolean;
    jwt?: string;
}