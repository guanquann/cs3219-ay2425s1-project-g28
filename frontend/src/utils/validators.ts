/* eslint-disable */

export const nameValidator = (value: string) => {
  if (value.length === 0) {
    return "Name must not be empty";
  }

  if (value.length > 50) {
    return "Name must be at most 50 characters long";
  }

  if (!/^[a-zA-Z\s-]*$/.test(value)) {
    return "Name must contain only alphabetical, hyphen and white space characters";
  }

  return true;
};

export const usernameValidator = (value: string) => {
  if (value.length < 6 || value.length > 30) {
    return "Username must be between 6 and 30 characters long";
  }

  if (!/^[a-zA-Z0-9._]+$/.test(value)) {
    return "Username must contain only alphanumeric, underscore and full stop characters";
  }

  return true;
};

export const emailValidator = (value: string) => {
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    return "Email is invalid";
  }

  return true;
};

export const passwordValidator = (value: string) => {
  if (value.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/[a-z]/.test(value)) {
    return "Password must contain at least 1 lowercase letter";
  }

  if (!/[A-Z]/.test(value)) {
    return "Password must contain at least 1 uppercase letter";
  }

  if (!/\d/.test(value)) {
    return "Password must contain at least 1 digit";
  }

  if (!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)) {
    return "Password must contain at least 1 special character";
  }

  return true;
};
