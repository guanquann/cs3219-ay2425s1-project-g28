import { useParams } from "react-router-dom";
import AppMargin from "../../components/AppMargin";
import ProfileDetails from "../../components/ProfileDetails";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import classes from "./index.module.css";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ServerError from "../../components/ServerError";
import EditProfileModal from "../../components/EditProfileModal";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import { useProfile } from "../../contexts/ProfileContext";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const auth = useAuth();

  const profile = useProfile();

  if (!auth) {
    throw new Error("useAuth() must be used within AuthProvider");
  }

  if (!profile) {
    throw new Error("useProfile() must be used within ProfileContextProvider");
  }

  const {
    user,
    editProfileOpen,
    passwordModalOpen,
    fetchUser,
    setEditProfileModalOpen,
    setPasswordModalOpen,
  } = profile;

  useEffect(() => {
    if (!userId) {
      return;
    }

    fetchUser(userId);
  }, []);

  if (!user) {
    return (
      <ServerError
        title="Oops, user not found..."
        subtitle="Unfortunately, we can't find who you're looking for 😥"
      />
    );
  }

  const isCurrentUser = auth.user?.id === userId;

  return (
    <AppMargin classname={classes.fullheight}>
      <Box
        sx={(theme) => ({
          marginTop: theme.spacing(4),
          display: "flex",
        })}
      >
        <Box sx={(theme) => ({ flex: 1, paddingRight: theme.spacing(4) })}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <ProfileDetails
              username={user.username}
              firstName={user.firstName}
              lastName={user.lastName}
              biography={user.biography}
            />
            {isCurrentUser && (
              <>
                <Divider />
                <Stack
                  spacing={2}
                  sx={(theme) => ({
                    marginTop: theme.spacing(4),
                    marginBottom: theme.spacing(4),
                  })}
                >
                  <Button
                    variant="contained"
                    onClick={() => setEditProfileModalOpen(true)}
                    sx={{ textTransform: "none" }}
                  >
                    Edit profile
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setPasswordModalOpen(true)}
                    sx={{ textTransform: "none" }}
                    color="secondary"
                  >
                    Change password
                  </Button>
                </Stack>
              </>
            )}
          </Box>
        </Box>
        <Box sx={(theme) => ({ flex: 3, paddingLeft: theme.spacing(4) })}>
          <Typography variant="h4">Questions attempted</Typography>
        </Box>
        <EditProfileModal
          open={editProfileOpen}
          onClose={() => setEditProfileModalOpen(false)}
          currFirstName={user.firstName}
          currLastName={user.lastName}
          currBiography={user.biography}
        />
        <ChangePasswordModal
          open={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
        />
      </Box>
    </AppMargin>
  );
};

export default ProfilePage;
