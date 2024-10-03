import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useProfile } from "../../contexts/ProfileContext";
import { bioValidator, nameValidator } from "../../utils/validators";

interface EditProfileModalProps {
  onClose: () => void;
  open: boolean;
  currFirstName: string;
  currLastName: string;
  currBiography?: string;
}

const StyledForm = styled("form")(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const EditProfileModal: React.FC<EditProfileModalProps> = (props) => {
  const { open, onClose, currFirstName, currLastName, currBiography } = props;

  const {
    register,
    formState: { errors, isValid, isDirty },
    handleSubmit,
  } = useForm<{
    firstName: string;
    lastName: string;
    biography: string;
  }>({
    defaultValues: {
      firstName: currFirstName,
      lastName: currLastName,
      biography: currBiography,
    },
    mode: "all",
  });

  const profile = useProfile();

  if (!profile) {
    throw new Error("useProfile() must be used within ProfileContextProvider");
  }

  const { updateProfile } = profile;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle fontSize={24}>Edit profile</DialogTitle>
      <DialogContent>
        <Container maxWidth="sm">
          <StyledForm
            onSubmit={handleSubmit((data) => {
              updateProfile(data);
              onClose();
            })}
          >
            <TextField
              fullWidth
              required
              label="First name"
              margin="normal"
              {...register("firstName", {
                validate: { nameValidator },
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              fullWidth
              required
              label="Last name"
              margin="normal"
              {...register("lastName", {
                validate: { nameValidator },
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <TextField
              fullWidth
              multiline
              label="Biography"
              margin="normal"
              {...register("biography", {
                validate: { bioValidator },
              })}
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
                type="submit"
                disabled={!isDirty || !isValid}
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

export default EditProfileModal;
