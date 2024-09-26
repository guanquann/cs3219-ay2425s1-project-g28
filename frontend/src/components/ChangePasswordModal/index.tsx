import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import PasswordTextField from '../PasswordTextField';
//import { userClient } from '../../utils/api';
//import axios from 'axios';
//import { FAILED_PW_UPDATE_MESSAGE, SUCCESS_PW_UPDATE_MESSAGE } from '../../utils/constants';

interface ChangePasswordModalProps {
  open: boolean;
  handleClose: () => void;
  userId: string;
  onUpdate: (message: string, isSuccess: boolean) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ 
  open, 
  handleClose,
  userId, 
  onUpdate
}) => {

  const [currPassword, setCurrPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isCurrPasswordValid, setIsCurrPasswordValid] = useState<boolean>(false);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState<boolean>(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<boolean>(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState<boolean>(true);
  
  useEffect(() => {
    setIsUpdateDisabled(!(isCurrPasswordValid && isNewPasswordValid && isConfirmPasswordValid));
    console.log(isNewPasswordValid, isConfirmPasswordValid);
  }, [isCurrPasswordValid, isNewPasswordValid, isConfirmPasswordValid]);

  const handleSubmit = async () => {
    //TODO: test with token (only tested without)
    /*const accessToken = localStorage.getItem("token");

    try {
      await userClient.patch(
        `/users/${userId}`,
        {
          oldPassword: currPassword,
          newPassword: newPassword,
        }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      handleClose();
      onUpdate(SUCCESS_PW_UPDATE_MESSAGE, true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message || FAILED_PW_UPDATE_MESSAGE;
        onUpdate(message, false);
      } else {
        onUpdate(FAILED_PW_UPDATE_MESSAGE, false);
      }
    }*/
  };

  return (
    <Modal 
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <Box 
          sx={(theme) => ({
            backgroundColor: theme.palette.common.white,
            display: "flex",
            width: 600,
            flexDirection: "column",
            alignItems: "center",
            borderRadius: '16px',
            padding: "40px",
          })}
        >
          <Typography component="h1" variant="h3">
            Change Password
          </Typography>
          <PasswordTextField 
            label="Current password" 
            passwordVal={false} 
            password={currPassword} 
            setPassword={setCurrPassword} 
            isMatch={false} 
            setValidity={setIsCurrPasswordValid}>
          </PasswordTextField>
          <PasswordTextField 
            label="New password" 
            passwordVal={true} 
            password={newPassword} 
            setPassword={setNewPassword} 
            isMatch={true} 
            passwordToMatch={confirmPassword}
            setValidity={setIsNewPasswordValid}>
          </PasswordTextField>
          <PasswordTextField 
            label="Confirm new password" 
            passwordVal={false} 
            password={confirmPassword} 
            setPassword={setConfirmPassword} 
            isMatch={true} 
            passwordToMatch={newPassword} 
            setValidity={setIsConfirmPasswordValid}></PasswordTextField>
          <Stack direction="row" spacing={2} sx={{marginTop: 2}}>
            <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" disabled={isUpdateDisabled} onClick={handleSubmit}>Update</Button>
          </Stack>
        </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
