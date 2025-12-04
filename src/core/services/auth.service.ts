import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import { LoginRequest, AuthResponse, SignUpRequest } from '../types/auth.types';


export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    try {
        const response = await httpClient.post<AuthResponse>('/auth/login', data as Record<string, any>);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const signup = async (data: SignUpRequest): Promise<AuthResponse> => {
    try {
        const response = await httpClient.post<AuthResponse>('/auth/signup', data as Record<string, any>);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const logout = async (): Promise<void> => {
    try {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};