import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Button, IconButton, Stack, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { questionClient } from "../../utils/api";
import { complexityList } from "../../utils/constants";
import AppMargin from "../../components/AppMargin";
import QuestionMarkdown from "../../components/QuestionMarkdown";
import QuestionImageContainer from "../../components/QuestionImageContainer";
import QuestionCategoryAutoComplete from "../../components/QuestionCategoryAutoComplete";
import QuestionDetail from "../../components/QuestionDetail";

const NewQuestion = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [markdownText, setMarkdownText] = useState<string>("");
  const [selectedComplexity, setselectedComplexity] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploadedImagesUrl, setUploadedImagesUrl] = useState<string[]>([]);
  const [isPreviewQuestion, setIsPreviewQuestion] = useState<boolean>(false);

  const handleBack = () => {
    if (title || markdownText || selectedComplexity || selectedCategories.length > 0) {
      if (!confirm("Are you sure you want to leave this page? All process will be lost.")) {
        return;
      }
    }
    navigate("/questions");
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

      {isPreviewQuestion ? (
        <QuestionDetail
          title={title}
          complexity={selectedComplexity}
          categories={selectedCategories}
          description={markdownText}
        />
      ) : (
        <>
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

          <QuestionCategoryAutoComplete
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />

          <QuestionImageContainer
            uploadedImagesUrl={uploadedImagesUrl}
            setUploadedImagesUrl={setUploadedImagesUrl}
          />

          <QuestionMarkdown markdownText={markdownText} setMarkdownText={setMarkdownText} />
        </>
      )}

      <Stack spacing={2} direction="row" paddingTop={2} paddingBottom={8}>
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Submit Question
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          disabled={
            !title && !markdownText && !selectedComplexity && selectedCategories.length === 0
          }
          onClick={() => setIsPreviewQuestion((prev) => !prev)}
        >
          {isPreviewQuestion ? "Edit Question" : "Preview Question"}
        </Button>
      </Stack>

      <ToastContainer position="bottom-right" />
    </AppMargin>
  );
};

export default NewQuestion;
