import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Box, Button, IconButton, Stack, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import QuestionMarkdown from "../components/question/QuestionMarkdown";
import QuestionImageContainer from "../components/question/QuestionImageContainer";

// hardcode for now
const difficultyList: string[] = ["Easy", "Medium", "Hard"];
const categoryList: string[] = [
  "Array",
  "Hashmap",
  "Stack",
  "DP",
  "Bitwise",
  "DFS",
  "BFS",
  "Tree",
  "Graph",
  "String",
  "Math",
  "Design",
  "SQL",
  "Shell",
  "Concurrency",
  "System Design",
  "Others",
];

const NewQuestion = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [markdownText, setMarkdownText] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploadedImagesUrl, setUploadedImagesUrl] = useState<string[]>([]);

  const handleBack = () => {
    if (title || markdownText || selectedDifficulty || selectedCategories.length > 0) {
      if (!confirm("Are you sure you want to leave this page? All process will be lost.")) {
        return;
      }
    }
    navigate("/question");
  };

  // File upload adapted from https://firebase.google.com/docs/storage/web/upload-files#web_2
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files![i];

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is more than 5MB`);
        continue;
      }

      const storageRef = ref(storage, uuidv4());
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
          toast.error("Upload of images failed");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadedImagesUrl((prevUrls) => [...prevUrls, downloadURL]);
          });
        }
      );
    }
  };

  const handleSubmit = async () => {
    try {
      console.log(title, markdownText, selectedDifficulty, selectedCategories);

      if (!title || !markdownText || !selectedDifficulty || selectedCategories.length === 0) {
        toast.error("Please fill in all fields");
        return;
      }

      // insert API call here

      toast.success("Question successfully created");
    } catch (error) {
      console.error(error);
      toast.success("Failed to create question");
    }
  };

  return (
    <Box sx={{ maxWidth: "70vw", margin: "auto" }}>
      <IconButton onClick={handleBack}>
        <ArrowBackIcon />
      </IconButton>

      <TextField
        label="Title"
        variant="outlined"
        size="small"
        fullWidth
        autoComplete="off"
        value={title}
        sx={{ marginTop: 2 }}
        onChange={(value) => setTitle(value.target.value)}
      />

      <Autocomplete
        options={difficultyList}
        size="small"
        sx={{ marginTop: 2 }}
        onChange={(e, newDifficultySelected) => {
          setSelectedDifficulty(newDifficultySelected);
        }}
        renderInput={(params) => <TextField {...params} label="Difficulty" />}
      />

      <Autocomplete
        multiple
        options={categoryList}
        size="small"
        sx={{ marginTop: 2 }}
        onChange={(e, newCategoriesSelected) => {
          setSelectedCategories(newCategoriesSelected);
        }}
        renderInput={(params) => <TextField {...params} label="Category" />}
      />

      <QuestionImageContainer
        handleImageUpload={handleImageUpload}
        uploadedImagesUrl={uploadedImagesUrl}
      />

      <QuestionMarkdown markdownText={markdownText} setMarkdownText={setMarkdownText} />

      <Stack spacing={2} direction="row" paddingTop={2}>
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Submit Question
        </Button>
        <Button variant="contained" color="secondary" fullWidth>
          Preview Question
        </Button>
      </Stack>

      <ToastContainer position="bottom-right" />
    </Box>
  );
};

export default NewQuestion;
