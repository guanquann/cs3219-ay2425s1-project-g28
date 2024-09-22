import { useEffect, useState, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, Button, IconButton, Stack, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { questionClient } from "../../utils/api";
import { complexityList, categoryList } from "../../utils/constants";
import reducer, { getQuestionById, initialState } from "../../reducers/questionReducer";
import AppMargin from "../../components/AppMargin";
import QuestionMarkdown from "../../components/QuestionMarkdown";
import QuestionImageContainer from "../../components/QuestionImageContainer";

const QuestionEdit = () => {
  const navigate = useNavigate();

  const { questionId } = useParams<{ questionId: string }>();
  const [state, dispatch] = useReducer(reducer, initialState);

  const [title, setTitle] = useState<string>("");
  const [markdownText, setMarkdownText] = useState<string>("");
  const [selectedComplexity, setselectedComplexity] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploadedImagesUrl, setUploadedImagesUrl] = useState<string[]>([]);

  useEffect(() => {
    if (!questionId) {
      return;
    }
    getQuestionById(questionId, dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.selectedQuestion) {
      setTitle(state.selectedQuestion.title);
      setMarkdownText(state.selectedQuestion.description);
      setselectedComplexity(state.selectedQuestion.complexity);
      setSelectedCategories(state.selectedQuestion.categories);
    }
  }, [state.selectedQuestion]);

  const handleBack = () => {
    if (!confirm("Are you sure you want to leave this page? All process will be lost.")) {
      return;
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

  const handleUpdate = async () => {
    if (!state.selectedQuestion) {
      return;
    }

    if (
      title === state.selectedQuestion.title &&
      markdownText === state.selectedQuestion.description &&
      selectedComplexity === state.selectedQuestion.complexity &&
      selectedCategories === state.selectedQuestion.categories
    ) {
      toast.error("You have not made any changes to the question");
      return;
    }

    try {
      await questionClient.put(
        `/${state.selectedQuestion.questionId}`,
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
        const message = error.response?.data.message || "Failed to update question";
        toast.error(message);
      } else {
        toast.error("Failed to update question");
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
        value={selectedComplexity}
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
        value={selectedCategories}
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

      <Stack paddingTop={2} paddingBottom={8}>
        <Button variant="contained" fullWidth onClick={handleUpdate}>
          Update Question
        </Button>
      </Stack>

      <ToastContainer position="bottom-right" />
    </AppMargin>
  );
};

export default QuestionEdit;
