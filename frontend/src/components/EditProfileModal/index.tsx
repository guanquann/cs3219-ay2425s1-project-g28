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

interface EditProfileModalProps {
  onClose: () => void;
  open: boolean;
  currFirstName: string;
  currLastName: string;
  currBiography?: string;
  onUpdate: ({
    firstName,
    lastName,
    biography,
  }: {
    firstName: string;
    lastName: string;
    biography: string;
  }) => void;
}

const StyledForm = styled("form")(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const EditProfileModal: React.FC<EditProfileModalProps> = (props) => {
  const {
    open,
    onClose,
    currFirstName,
    currLastName,
    currBiography,
    onUpdate,
  } = props;
  const nameCharLimit = 50;
  const bioCharLimit = 255;

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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle fontSize={24}>Edit profile</DialogTitle>
      <DialogContent>
        <Container maxWidth="sm">
          <StyledForm
            onSubmit={handleSubmit((data) => {
              onUpdate(data);
              onClose();
            })}
          >
            <TextField
              fullWidth
              required
              label="First name"
              margin="normal"
              {...register("firstName", {
                required: true,
                minLength: { value: 1, message: "Required field" },
                maxLength: {
                  value: nameCharLimit,
                  message: "Max length exceeded",
                },
                pattern: {
                  value: /^[a-zA-Z\s-]*$/,
                  message:
                    "Only alphabetical, hyphen and white space characters allowed",
                },
              })}
              error={!!errors.firstName}
              helperText={errors.firstName && errors.firstName.message}
            />
            <TextField
              fullWidth
              required
              label="Last name"
              margin="normal"
              {...register("lastName", {
                required: true,
                minLength: { value: 1, message: "Required field" },
                maxLength: {
                  value: nameCharLimit,
                  message: "Max length exceeded",
                },
                pattern: {
                  value: /^[a-zA-Z\s-]*$/,
                  message:
                    "Only alphabetical, hyphen and white space characters allowed",
                },
              })}
              error={!!errors.lastName}
              helperText={errors.lastName && errors.lastName.message}
            />
            <TextField
              fullWidth
              multiline
              label="Biography"
              margin="normal"
              {...register("biography", {
                maxLength: {
                  value: bioCharLimit,
                  message: "Max length exceeded",
                },
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
