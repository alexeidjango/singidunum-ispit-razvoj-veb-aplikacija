export const AUTH_LOGIN = "/auth/login/";
export const AUTH_REGISTER = "/auth/register/";
export const AUTH_REFRESH = "/auth/token/refresh/";
export const AUTH_PASSWORD_CHANGE = "/auth/password-change/";
export const USERS_ME = "/users/me/";
export const SAVED_RECIPIENTS = "/saved-recipients/";
export const PAYMENT_ORDERS = "/payment-orders/";

export const byId = (base: string, id: number | string) => `${base}${id}/`;
