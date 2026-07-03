import { api } from "@/lib/api/api";

interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    password: string;
}

export const registerUser = async (payload: RegisterPayload) => {
    const response = await api.post("/api/users/register", payload);
    return response.data
}

export const login = async (payload: LoginPayload) => {
    const response = await api.post("/api/users/login", payload);

    return response.data;
}