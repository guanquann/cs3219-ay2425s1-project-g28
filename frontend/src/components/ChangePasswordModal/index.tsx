import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useProfile } from "../../contexts/ProfileContext";
import { passwordValidator } from "../../utils/validators";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const StyledForm = styled("form")(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = (props) => {
  const { open, onClose } = props;
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    mode: "all",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profile = useProfile();

  if (!profile) {
    throw new Error("useProfile() must be used within ProfileContextProvider");
  }

  const { updatePassword } = profile;

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle fontSize={24}>Change password</DialogTitle>
      <DialogContent>
        <Container maxWidth="sm">
          <StyledForm
            onSubmit={handleSubmit((data) => {
              updatePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
              });
              onClose();
            })}
          >
            <TextField
              label="Current password"
              required
              fullWidth
              margin="normal"
              type={showOldPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowOldPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseUp={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...register("oldPassword")}
            />
            <TextField
              label="New password"
              required
              fullWidth
              margin="normal"
              type={showNewPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseUp={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...register("newPassword", {
                validate: { passwordValidator },
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
            <TextField
              label="Confirm password"
              required
              fullWidth
              margin="normal"
              type={showConfirmPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseUp={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...register("confirmPassword", {
                validate: {
                  matchPassword: (value) =>
                    watch("newPassword") === value || "Password does not match",
                },
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Stack
              direction={"row"}
              spacing={2}
              sx={(theme) => ({ marginTop: theme.spacing(1) })}
            >
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                disabled={!isDirty || !isValid}
                type="submit"
              >
                Update
              </Button>
            </Stack>
          </StyledForm>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
