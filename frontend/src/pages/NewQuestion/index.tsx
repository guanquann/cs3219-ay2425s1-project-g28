import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Button, IconButton, Stack, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { questionClient } from "../../utils/api";
import { complexityList, categoryList } from "../../utils/constants";
import AppMargin from "../../components/AppMargin";
import QuestionMarkdown from "../../components/QuestionMarkdown";
import QuestionImageContainer from "../../components/QuestionImageContainer";

const NewQuestion = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [markdownText, setMarkdownText] = useState<string>("");
  const [selectedComplexity, setselectedComplexity] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploadedImagesUrl, setUploadedImagesUrl] = useState<string[]>([]);

  const handleBack = () => {
    if (title || markdownText || selectedComplexity || selectedCategories.length > 0) {
      if (!confirm("Are you sure you want to leave this page? All process will be lost.")) {
        return;
      }
    }
    navigate("/questions");
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const formData = new FormData();
    for (const file of event.target.files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is more than 5MB`);
        continue;
      }
      formData.append("images[]", file);
    }

    try {
      const response = await questionClient.post("/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: false,
      });

      const data = response.data;
      for (const imageUrl of data.imageUrls) {
        setUploadedImagesUrl((prev) => [...prev, imageUrl]);
      }

      toast.success("File uploaded successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Error uploading file");
      } else {
        console.error(error);
        toast.error("Error uploading file");
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !markdownText || !selectedComplexity || selectedCategories.length === 0) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await questionClient.post(
        "/",
        {
          title,
          description: markdownText,
          complexity: selectedComplexity,
          category: selectedCategories,
        },
        {
          withCredentials: false,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/questions");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data.message || "Failed to create question";
        toast.error(message);
      } else {
        toast.error("Failed to create question");
      }
    }
  };

  return (
    <AppMargin>
      <IconButton onClick={handleBack} sx={{ marginTop: 2 }}>
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
        options={complexityList}
        size="small"
        sx={{ marginTop: 2 }}
        onChange={(e, newcomplexitySelected) => {
          setselectedComplexity(newcomplexitySelected);
        }}
        renderInput={(params) => <TextField {...params} label="Complexity" />}
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

      <Stack spacing={2} direction="row" paddingTop={2} paddingBottom={8}>
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Submit Question
        </Button>
        <Button variant="contained" color="secondary" fullWidth>
          Preview Question
        </Button>
      </Stack>

      <ToastContainer position="bottom-right" />
    </AppMargin>
  );
};

export default NewQuestion;
