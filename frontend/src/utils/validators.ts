/* eslint-disable */

import {
  PASSWORD_DIGIT_ERROR_MESSAGE,
  PASSWORD_LOWER_CASE_ERROR_MESSAGE,
  PASSWORD_MIN_LENGTH_ERROR_MESSAGE,
  PASSWORD_SPECIAL_CHAR_ERROR_MESSAGE,
  PASSWORD_UPPER_CASE_ERROR_MESSAGE,
} from "./constants";

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

export const bioValidator = (value: string) => {
  if (value.length > 255) {
    return "Biography must be at most 255 characters long";
  }

  return true;
};

export const passwordValidator = (value: string) => {
  if (value.length < 8) {
    return PASSWORD_MIN_LENGTH_ERROR_MESSAGE;
  }

  if (!/[a-z]/.test(value)) {
    return PASSWORD_LOWER_CASE_ERROR_MESSAGE;
  }

  if (!/[A-Z]/.test(value)) {
    return PASSWORD_UPPER_CASE_ERROR_MESSAGE;
  }

  if (!/\d/.test(value)) {
    return PASSWORD_DIGIT_ERROR_MESSAGE;
  }

  if (!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)) {
    return PASSWORD_SPECIAL_CHAR_ERROR_MESSAGE;
  }

  return true;
};
