import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Button, IconButton, Stack, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppMargin from "../../components/AppMargin";
import QuestionMarkdown from "../../components/QuestionMarkdown";
import QuestionImageContainer from "../../components/QuestionImageContainer";

// hardcode for now
const complexityList: string[] = ["Easy", "Medium", "Hard"];
const categoryList: string[] = [
  "Strings",
  "Algorithms",
  "Data Structures",
  "Bit Manipulation",
  "Recursion",
  "Databases",
  "Arrays",
  "Brainteaser",
];

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
      const response = await fetch("http://localhost:3000/api/questions/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      for (const imageUrl of data.imageUrls) {
        setUploadedImagesUrl((prev) => [...prev, imageUrl]);
      }
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading file");
    }
  };

  const handleSubmit = async () => {
    if (!title || !markdownText || !selectedComplexity || selectedCategories.length === 0) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: markdownText,
          complexity: selectedComplexity,
          category: selectedCategories,
        }),
      });

      const data = await response.json();
      if (response.status === 400) {
        toast.error(data.message);
        return;
      }

      toast.success("Question successfully created");
      navigate("/questions");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create question");
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
