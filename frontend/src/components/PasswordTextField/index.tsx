import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

interface PasswordTextFieldProps {
  label: string;
  passwordVal: boolean;
  password: string;
  setPassword: (password: string) => void;
  isMatch: boolean;
  passwordToMatch?: string;
  setValidity: (isValid: boolean) => void;
}

const PasswordTextField: React.FC<PasswordTextFieldProps> = ({
  label,
  passwordVal,
  password,
  setPassword,
  isMatch,
  passwordToMatch,
  setValidity,
}) => {
  const validatePasswordError = (
    passwordVal: boolean,
    password: string
  ): boolean => {
    return passwordVal
      ? password.length < 8 ||
          !/[a-z]/.test(password) ||
          !/[A-Z]/.test(password) ||
          !/\d/.test(password) ||
          // eslint-disable-next-line no-useless-escape
          !/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)
      : false;
  };

  const comparePasswordError = (
    isMatch: boolean,
    password: string,
    passwordToMatch: string | undefined
  ): boolean => {
    return isMatch ? password != passwordToMatch : false;
  };

  const checkEmptyError = (password: string): boolean => {
    return !password;
  };

  const isInvalid =
    validatePasswordError(passwordVal, password) ||
    comparePasswordError(isMatch, password, passwordToMatch) ||
    checkEmptyError(password);

  //to listen to other password input changes
  useEffect(() => {
    setValidity(
      !(
        validatePasswordError(passwordVal, password) ||
        comparePasswordError(isMatch, password, passwordToMatch) ||
        checkEmptyError(password)
      )
    );
  }, [passwordVal, isMatch, password, passwordToMatch, setValidity]);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setPassword(val);
    setValidity(
      !(
        validatePasswordError(passwordVal, val) ||
        comparePasswordError(isMatch, val, passwordToMatch) ||
        checkEmptyError(val)
      )
    );
  };

  return (
    <FormControl fullWidth>
      <TextField
        required
        id="outlined-basic"
        label={label}
        type={showPassword ? "text" : "password"}
        sx={{ marginTop: 2 }}
        value={password}
        error={isInvalid}
        onChange={handlePasswordChange}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      {checkEmptyError(password) && (
        <FormHelperText error={checkEmptyError(password)}>
          Required field
        </FormHelperText>
      )}
      {validatePasswordError(passwordVal, password) && (
        <div>
          <FormHelperText
            sx={(theme) => ({ color: theme.palette.success.main })}
            error={password.length < 8}
          >
            Password must be at least 8 characters long
          </FormHelperText>
          <FormHelperText
            sx={(theme) => ({ color: theme.palette.success.main })}
            error={!/[a-z]/.test(password)}
          >
            Password must contain at least 1 lowercase letter
          </FormHelperText>
          <FormHelperText
            sx={(theme) => ({ color: theme.palette.success.main })}
            error={!/[A-Z]/.test(password)}
          >
            Password must contain at least 1 uppercase letter
          </FormHelperText>
          <FormHelperText
            sx={(theme) => ({ color: theme.palette.success.main })}
            error={!/\d/.test(password)}
          >
            Password must contain at least 1 digit
          </FormHelperText>
          <FormHelperText
            sx={(theme) => ({ color: theme.palette.success.main })}
            // eslint-disable-next-line no-useless-escape
            error={!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)}
          >
            Password must contain at least 1 special character
          </FormHelperText>
        </div>
      )}
      {comparePasswordError(isMatch, password, passwordToMatch) && (
        <FormHelperText
          error={comparePasswordError(isMatch, password, passwordToMatch)}
        >
          Password does not match
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default PasswordTextField;
