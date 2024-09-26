import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormHelperText, Modal, Stack, TextField, Typography } from '@mui/material';
//import { userClient } from '../../utils/api';
//import axios from 'axios';
//import { FAILED_PROFILE_UPDATE_MESSAGE, SUCCESS_PROFILE_UPDATE_MESSAGE } from '../../utils/constants';

interface EditProfileModalProps {
  open: boolean;
  handleClose: () => void;
  currFirstName: string;
  currLastName: string;
  currBiography?: string;
  userId: string;
  onUpdate: (message: string, isSuccess: boolean) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  open,
  handleClose,
  currFirstName,
  currLastName,
  currBiography,
  //userId,
  //onUpdate,
}) => {
  const nameCharLimit = 50;
  const bioCharLimit = 255;
  const [newFirstName, setNewFirstName] = useState<string>('');
  const [newLastName, setNewLastName] = useState<string>('');
  const [newBio, setNewBio] = useState<string>('');

  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState<boolean>(true);

  useEffect(() => {
    checkForChanges();
    setIsUpdateDisabled(firstNameError || lastNameError || !isChanged)
  }, [firstNameError, lastNameError, newFirstName, newLastName, newBio])

  const checkForChanges = () => {
    if (newFirstName != currFirstName || 
      newLastName != currLastName || 
      newBio != currBiography) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }

  const handleSubmit = async () => {
    // TODO: test with token (only tested without)
    /*const accessToken = localStorage.getItem("token");

    try {
      await userClient.patch(
        `/users/${userId}`,
        {
          firstName: newFirstName,
          lastName: newLastName,
          biography: newBio,
        }, 
        {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            },
        });
        handleClose();
        onUpdate(SUCCESS_PROFILE_UPDATE_MESSAGE, true);
    } catch (error) {
        console.error('Error:', error);
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data.message || FAILED_PROFILE_UPDATE_MESSAGE;
          onUpdate(message, false);
        } else {
          onUpdate(FAILED_PROFILE_UPDATE_MESSAGE, false);
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
      }}>
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
          Edit Profile
        </Typography>
        <FormControl
          fullWidth>
          <TextField
            id="outlined-basic" 
            label="First name"
            sx={{marginTop: 2}} 
            slotProps={{
              htmlInput: {
                maxLength: nameCharLimit,
              },
            }}
            defaultValue={currFirstName}
            onChange={(input) => {
              const val = input.target.value;
              if (!/^[a-zA-Z\s-]*$/.test(val)) {
                setFirstNameError(true);
              } else {
                setFirstNameError(false);
              }
              setNewFirstName(val);
            }}
            error={firstNameError}
          />
          {firstNameError 
            ? (<Stack
                direction="row"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}>
                <FormHelperText error={firstNameError}>Only alphabetical, hyphen and white space characters allowed</FormHelperText>
                <FormHelperText>{newFirstName.length} / {nameCharLimit} characters</FormHelperText>
              </Stack>) 
            : (<FormHelperText sx={{textAlign: "right"}}>{newFirstName.length} / {nameCharLimit} characters</FormHelperText>)}
        </FormControl>
        <FormControl
          fullWidth>
          <TextField
            id="outlined-basic" 
            label="Last name"
            sx={{marginTop: 2}} 
            slotProps={{
              htmlInput: {
                maxLength: nameCharLimit,
              },
            }}
            defaultValue={currLastName}
            onChange={(input) => {
              const val = input.target.value;
              if (!/^[a-zA-Z\s-]*$/.test(val)) {
                setLastNameError(true);
              } else {
                setLastNameError(false);
              }
              setNewLastName(val);
            }}
            error={lastNameError}
          />
          {lastNameError 
            ? (<Stack
                direction="row"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}>
                <FormHelperText error={lastNameError}>Only alphabetical, hyphen and white space characters allowed</FormHelperText>
                <FormHelperText>{newLastName.length} / {nameCharLimit} characters</FormHelperText>
              </Stack>) 
            : (<FormHelperText sx={{textAlign: "right"}}>{newLastName.length} / {nameCharLimit} characters</FormHelperText>)}
        </FormControl>
        <TextField
          fullWidth
          id="outlined-basic" 
          label="Biography"
          sx={{marginTop: 2}} 
          slotProps={{
            htmlInput: {
              maxLength: bioCharLimit,
            },
            formHelperText: {
              sx: { textAlign: "right" },
            },
          }}
          defaultValue={currBiography}
          onChange={(input) => {
            setNewBio(input.target.value);
          }}
          helperText={
            newBio.length + ` / ${bioCharLimit} characters`
          }
        />
        <Stack direction="row" spacing={2} sx={{marginTop: 2}}>
          <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" disabled={isUpdateDisabled} onClick={handleSubmit}>Update</Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditProfileModal;
