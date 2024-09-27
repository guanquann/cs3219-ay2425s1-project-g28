import { useParams } from "react-router-dom";
import AppMargin from "../../components/AppMargin";
import ProfileSection from "../../components/ProfileSection";
import { Box, Typography } from "@mui/material";
import classes from "./index.module.css";
import { useEffect, useState } from "react";
import { userClient } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import ServerError from "../../components/ServerError";

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

  return (
    <AppMargin classname={classes.fullheight}>
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
          />
        </Box>
        <Box sx={(theme) => ({ flex: 3, paddingLeft: theme.spacing(4) })}>
          <Typography variant="h4">Questions attempted</Typography>
        </Box>
      </Box>
    </AppMargin>
  );
};

export default ProfilePage;
