import { useParams } from "react-router-dom";
import AppMargin from "../../components/AppMargin";
import ProfileSection from "../../components/ProfileSection";
import { Box, Typography } from "@mui/material";
import classes from "./index.module.css";
import { useEffect, useState } from "react";
import { userClient } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

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
  }, []);

  if (!userProfile) {
    return (
      <AppMargin classname={`${classes.fullheight} ${classes.center}`}>
        <Box>
          <Typography
            component={"h1"}
            variant="h3"
            textAlign={"center"}
            sx={(theme) => ({ marginBottom: theme.spacing(4) })}
          >
            Oops, user not found...
          </Typography>
          <Typography textAlign={"center"}>
            Unfortunately, we can't find who you're looking for 😥
          </Typography>
        </Box>
      </AppMargin>
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
