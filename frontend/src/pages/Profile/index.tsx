import { useParams } from "react-router-dom";
import AppMargin from "../../components/AppMargin";
import ProfileSection from "../../components/ProfileSection";
import { Box, Modal, Typography } from "@mui/material";
import classes from "./index.module.css";
import { useEffect, useState } from "react";
import { userClient } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ServerError from "../../components/ServerError";
import EditProfileModal from "../../components/EditProfileModal";
import ChangePasswordModal from "../../components/ChangePasswordModal";

type UserProfile = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  biography?: string;
  profilePictureUrl?: string;
  createdAt: string;
};

const ProfilePage: React.FC = () => {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const handleEditProfileOpen = () => setEditProfileOpen(true);
  const handleEditProfileClose = () => setEditProfileOpen(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const handleChangePasswordOpen = () => setChangePasswordOpen(true);
  const handleChangePasswordClose = () => setChangePasswordOpen(false);

  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const auth = useAuth();

  if (!auth) {
    throw new Error("useAuth() must be used within AuthProvider");
  }

  const { user } = auth;

  useEffect(() => {
    userClient
      .get(`/users/${userId}`)
      .then((res) => {
        setUserProfile(res.data.data);
      })
      .catch(() => setUserProfile(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userProfile) {
    return (
      <ServerError
        title="Oops, user not found..."
        subtitle="Unfortunately, we can't find who you're looking for 😥"
      />
    );
  }

  const notify = (message: string, isSuccess: boolean) => {
    if (isSuccess) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }

  return (
    userId &&
    (<AppMargin classname={classes.fullheight}>
      <Box
        sx={(theme) => ({
          marginTop: theme.spacing(4),
          display: "flex",
        })}
      >
        <Box sx={(theme) => ({ flex: 1, paddingRight: theme.spacing(4) })}>
          <ProfileSection
            firstName={userProfile.firstName}
            lastName={userProfile.lastName}
            username={userProfile.username}
            biography={userProfile.biography}
            isCurrentUser={user?.id === userId}
            handleEditProfileOpen={handleEditProfileOpen}
            handleChangePasswordOpen={handleChangePasswordOpen}
          />
        </Box>
        <Box sx={(theme) => ({ flex: 3, paddingLeft: theme.spacing(4) })}>
          <Typography variant="h4">Questions attempted</Typography>
        </Box>
        <Modal
          open={editProfileOpen}
          onClose={handleEditProfileClose}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <EditProfileModal 
            handleClose={handleEditProfileClose} 
            currFirstName={userProfile.firstName} 
            currLastName={userProfile.lastName}
            currBiography={userProfile.biography}
            userId={userId}
            onUpdate={notify} />
        </Modal>
        <Modal
          open={changePasswordOpen}
          onClose={handleChangePasswordClose}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <ChangePasswordModal 
            handleClose={handleChangePasswordClose}
            userId={userId}
            onUpdate={notify} />
        </Modal>
      </Box>

      <ToastContainer position="bottom-right" />
    </AppMargin>)
  );
};

export default ProfilePage;
