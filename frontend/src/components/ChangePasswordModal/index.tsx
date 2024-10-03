import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  styled,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useProfile } from "../../contexts/ProfileContext";
import { passwordValidator } from "../../utils/validators";
import PasswordTextField from "../PasswordTextField";

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
            <PasswordTextField
              label="Current password"
              required
              fullWidth
              margin="normal"
              {...register("oldPassword")}
            />
            <PasswordTextField
              displayTooltip
              label="New password"
              required
              fullWidth
              margin="normal"
              {...register("newPassword", {
                validate: { passwordValidator },
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
            <PasswordTextField
              label="Confirm password"
              required
              fullWidth
              margin="normal"
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
