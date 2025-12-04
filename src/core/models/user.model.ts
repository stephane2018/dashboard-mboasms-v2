export interface User {
    email: string;
    full_name: string;
    phone: string;
    role: string;
    company_id: number;
    location_id: number;
    is_active: boolean;
    is_verified: boolean;
    id: number;
    has_pin: boolean;
    pin_attempts: number;
    pin_locked_until: string;
    last_login: string;
    created_at: string;
    updated_at: string;
}
export interface UserResponse {
  access_token: string;
  token_type: string;
  user: User;
}
