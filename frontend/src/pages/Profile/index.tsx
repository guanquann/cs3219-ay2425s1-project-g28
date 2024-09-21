import { useParams } from "react-router-dom";
import AppMargin from "../../components/AppMargin";
import ProfileSection from "../../components/ProfileSection";
import { Box, Typography } from "@mui/material";
import classes from "./index.module.css";
import { useEffect, useState } from "react";

type UserProfile = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  biography?: string;
};

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  console.log(username);

  useEffect(() => {
    // TODO: fetch user details
    setUserProfile({
      id: "1",
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      biography:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    });
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
            isCurrentUser={true} // change this to hide the buttons, hardcoding the details for now
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
