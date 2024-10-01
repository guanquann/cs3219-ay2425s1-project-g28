import { createContext, useContext, useState } from "react";
import { userClient } from "../utils/api";
import {
  FAILED_PROFILE_UPDATE_MESSAGE,
  FAILED_PW_UPDATE_MESSAGE,
  SUCCESS_PROFILE_UPDATE_MESSAGE,
  SUCCESS_PW_UPDATE_MESSAGE,
} from "../utils/constants";
import { toast } from "react-toastify";

interface UserProfileBase {
  firstName: string;
  lastName: string;
  biography?: string;
}

interface UserProfile extends UserProfileBase {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  profilePictureUrl?: string;
  createdAt: string;
}

type ProfileContextType = {
  user: UserProfile | null;
  editProfileOpen: boolean;
  passwordModalOpen: boolean;
  fetchUser: (userId: string) => void;
  updateProfile: (data: UserProfileBase) => void;
  updatePassword: ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) => void;
  setEditProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPasswordModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const ProfileContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editProfileOpen, setEditProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const fetchUser = (userId: string) => {
    userClient
      .get(`/users/${userId}`)
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null));
  };

  const updateProfile = async (data: UserProfileBase) => {
    const token = localStorage.getItem("token");
    await userClient
      .patch(`/users/${user?.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.data);
        toast.success(SUCCESS_PROFILE_UPDATE_MESSAGE);
      })
      .catch((err) => {
        const message =
          err.response.data.message || FAILED_PROFILE_UPDATE_MESSAGE;
        toast.error(message);
      });
  };

  const updatePassword = async ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const token = localStorage.getItem("token");
    await userClient
      .patch(
        `/users/${user?.id}`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => toast.success(SUCCESS_PW_UPDATE_MESSAGE))
      .catch((err) => {
        const message = err.response.data.message || FAILED_PW_UPDATE_MESSAGE;
        toast.error(message);
      });
  };

  return (
    <ProfileContext.Provider
      value={{
        user,
        passwordModalOpen,
        editProfileOpen,
        fetchUser,
        updateProfile,
        updatePassword,
        setEditProfileModalOpen,
        setPasswordModalOpen,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

export default ProfileContextProvider;
