import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, TextFieldPropsSizeOverrides, TextFieldVariants } from "@mui/material";
import { OverridableStringUnion } from '@mui/types';
import { useState } from "react";

// Adapted from https://muhimasri.com/blogs/mui-validation/
type CustomTextFieldProps = {
  label: string;
  variant?: TextFieldVariants; 
  size?: OverridableStringUnion<"small" | "medium", TextFieldPropsSizeOverrides>;
  required?: boolean;
  emptyField?: boolean;
  validator?: (value: string) => string;
  onChange: (value: string, isValid: boolean) => void;
  isPasswordField?: boolean;
};

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  variant = "outlined",
  size = "medium",
  required = false,
  emptyField = false,
  validator,
  onChange,
  isPasswordField = false,
}) => {
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(!isPasswordField);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    
    let errorMessage = "";
    if (validator) {
      errorMessage = validator(input);
      setError(errorMessage);
    }

    onChange(input, !errorMessage);
  };

  return (
    <TextField
      label={label}
      variant={variant}
      size={size}
      required={required}
      onChange={handleChange}
      error={(required && emptyField) || !!error}
      helperText={error}
      type={showPassword ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: isPasswordField && (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }
      }}
    />
  );
};

export default CustomTextField;
