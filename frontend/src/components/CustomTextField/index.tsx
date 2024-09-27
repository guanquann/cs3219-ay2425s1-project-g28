import { TextField, TextFieldPropsSizeOverrides, TextFieldVariants } from "@mui/material";
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
};

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  variant = "outlined",
  size = "medium",
  required = false,
  emptyField = false,
  validator,
  onChange,
}) => {
  const [error, setError] = useState<string>("");

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
    />
  );
};

export default CustomTextField;
