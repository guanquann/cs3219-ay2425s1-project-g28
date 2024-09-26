import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormControl, FormHelperText, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

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
  const [valError, setValError] = useState<boolean>(false);
  const [mismatchError, setMismatchError] = useState<boolean>(false);
  const [emptyError, setEmptyError] = useState<boolean>(true);
  
  const validatePassword = (password: string) => {
    if (password.length < 8 || 
      !/[a-z]/.test(password) || 
      !/[A-Z]/.test(password) || 
      !/\d/.test(password) ||
      // eslint-disable-next-line no-useless-escape
      !/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
      setValError(true);
    } else {
      setValError(false);
    }
  };

  const comparePassword = (password: string, passwordToConfirm: string) => {
    if (password != passwordToConfirm) {
      setMismatchError(true);
    } else {
      setMismatchError(false);
    }
  }

  const checkEmpty = (password: string) => {
    if (!password) {
      setEmptyError(true);
    } else {
      setEmptyError(false);
    }
  }

  useEffect(() => {
    setValidity(!(valError || mismatchError || emptyError));
  }, [valError, mismatchError, emptyError])

  //to listen to other password input changes
  useEffect(() => {
    if (isMatch && passwordToMatch != undefined) {
      comparePassword(password, passwordToMatch)
    }
  }, [passwordToMatch]);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setPassword(val);
    
    checkEmpty(val);
    if (passwordVal) {
      validatePassword(val);
    }
    if (isMatch && passwordToMatch != undefined) {
      comparePassword(val, passwordToMatch);
    }
  };


  return (
    <FormControl fullWidth>
      <TextField 
        required  
        id="outlined-basic" 
        label={label}
        type={showPassword ? 'text' : 'password'} 
        sx={{marginTop: 2}} 
        value={password}
        error={valError || mismatchError}
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
          }
        }}/>
        {emptyError && (
          <FormHelperText error={emptyError}>Required field</FormHelperText>
        )}
        {passwordVal && valError && (
        <div>
          <FormHelperText sx={(theme) => ({color: theme.palette.success.main})} error={password.length < 8}>Password must be at least 8 characters long</FormHelperText>
          <FormHelperText sx={(theme) => ({color: theme.palette.success.main})} error={!/[a-z]/.test(password)}>Password must contain at least 1 lowercase letter</FormHelperText>
          <FormHelperText sx={(theme) => ({color: theme.palette.success.main})} error={!/[A-Z]/.test(password)}>Password must contain at least 1 uppercase letter</FormHelperText>
          <FormHelperText sx={(theme) => ({color: theme.palette.success.main})} error={!/\d/.test(password)}>Password must contain at least 1 digit</FormHelperText>
          {/*eslint-disable-next-line no-useless-escape*/}
          <FormHelperText sx={(theme) => ({color: theme.palette.success.main})} error={!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)}>Password must contain at least 1 special character</FormHelperText>
        </div>
        )}
        {isMatch && mismatchError && (
          <FormHelperText error={mismatchError}>Password does not match</FormHelperText>
        )}
    </FormControl>
  );
}

export default PasswordTextField;
