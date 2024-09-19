import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Button, ImageList, ImageListItem } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import "react-toastify/dist/ReactToastify.css";

import QuestionImage from "./QuestionImage";
import QuestionImageDialog from "./QuestionImageDialog";

const FileUploadInput = styled("input")({
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  width: 1,
});

interface QuestionImageContainerProps {
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedImagesUrl: string[];
}

const QuestionImageContainer: React.FC<QuestionImageContainerProps> = ({
  handleImageUpload,
  uploadedImagesUrl,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleClickOpen = (url: string) => {
    setOpen(true);
    setSelectedValue(url);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (uploadedImagesUrl.length === 0) {
    return (
      <Button
        component="label"
        variant="contained"
        disableElevation={true}
        sx={(theme) => ({
          borderRadius: 1,
          height: 128,
          width: "100%",
          backgroundColor: "#fff",
          color: "#757575",
          border: "1px solid",
          borderColor: theme.palette.grey[400],
          marginTop: 2,
        })}
      >
        <FileUploadIcon />
        Click to upload images. The maximum image size accepted is 5MB.
        <FileUploadInput
          type="file"
          accept="image/png,image/jpeg"
          onChange={(event) => handleImageUpload(event)}
          multiple
        />
      </Button>
    );
  }

  return (
    <>
      <ImageList cols={7} rowHeight={128} sx={{ paddingTop: 2 }}>
        {uploadedImagesUrl.map((image) => (
          <QuestionImage key={image} url={image} handleClickOpen={handleClickOpen} />
        ))}

        <ImageListItem sx={{ width: 128, height: 128 }}>
          <Button
            component="label"
            variant="contained"
            disableElevation={true}
            sx={(theme) => ({
              borderRadius: 1,
              height: 128,
              width: 128,
              backgroundColor: "#fff",
              color: "#757575",
              border: "1px solid",
              borderColor: theme.palette.grey[400],
              textAlign: "center",
            })}
          >
            <FileUploadIcon />
            Upload images
            <FileUploadInput
              type="file"
              accept="image/png,image/jpeg"
              onChange={(event) => handleImageUpload(event)}
              multiple
            />
          </Button>
        </ImageListItem>
      </ImageList>

      <QuestionImageDialog value={selectedValue} open={open} handleClose={handleClose} />
    </>
  );
};

export default QuestionImageContainer;
