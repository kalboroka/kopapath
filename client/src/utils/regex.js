export const nameRegex    = /^(?!.*\s{2,})(?=.*?\p{L})[\p{L}.'-]+(?: +[\p{L}.'-]+)*$/u;
export const mobileRegex  = /^254[1,7][0-9]{8}$/;
export const secretRegex  = /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{8,})/;
