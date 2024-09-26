import AppMargin from "../../components/AppMargin";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  FormControl,
  Grid2,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import classes from "./index.module.css";
import { useState } from "react";

const Home: React.FC = () => {
  const [complexity, setComplexity] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [language, setLanguage] = useState<string[]>([]);
  const [timeout, setTimeout] = useState<number>(5);

  const languages = ["Python", "Java"];

  //   useEffect(() => {
  //     // Fetch categories from the backend
  //     getCategories().then((res) => setCategories(res));
  //   }, []);

  const handleComplexityChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setComplexity(event.target.value as string);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const {
      target: { value },
    } = event;
    // setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setLanguage(event.target.value as string[]);
  };

  const handleTimeoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setTimeout(value > 30 ? 30 : value); // Ensure the timeout is <= 30
  };

  return (
    <AppMargin classname={`${classes.fullheight} ${classes.center}`}>
      <Typography
        component={"h1"}
        variant="h1"
        textAlign={"center"}
        sx={(theme) => ({
          fontWeight: "bold",
          color: "primary.main",
          marginBottom: theme.spacing(4),
        })}
      >
        Level up in your technical interviews!
      </Typography>

      <Typography
        variant="subtitle1"
        textAlign={"center"}
        sx={(theme) => ({
          fontSize: "h5.fontSize",
          marginBottom: theme.spacing(4),
        })}
      >
        Your ultimate technical interview preparation platform to practice
        whiteboard style interview questions with a peer.
      </Typography>

      <Card
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Grid2 container rowSpacing={1} columnSpacing={2} alignItems="center">
          <Grid2 size={2}>
            <Typography
              align="left"
              sx={{ fontWeight: "bold", paddingRight: 2 }}
            >
              Complexity
            </Typography>
          </Grid2>

          <Grid2 size={10}>
            <FormControl
              fullWidth
              sx={{ marginBottom: 2, backgroundColor: "white" }}
            >
              <InputLabel>Complexity</InputLabel>
              <Select
                value={complexity}
                // onChange={handleComplexityChange}
                label="Complexity"
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={2}>
            <Typography
              align="left"
              sx={{ fontWeight: "bold", paddingRight: 2 }}
            >
              Category
            </Typography>
          </Grid2>

          <Grid2 size={10}>
            <FormControl
              fullWidth
              sx={{ marginBottom: 2, backgroundColor: "white" }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                multiple
                value={selectedCategories}
                // onChange={handleCategoryChange}
                input={<OutlinedInput label="Category" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    <Checkbox
                      checked={selectedCategories.indexOf(category) > -1}
                    />
                    <ListItemText primary={category} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={2}>
            <Typography
              align="left"
              sx={{ fontWeight: "bold", paddingRight: 2 }}
            >
              Language
            </Typography>
          </Grid2>

          <Grid2 size={10}>
            <FormControl
              fullWidth
              sx={{ marginBottom: 2, backgroundColor: "white" }}
            >
              <InputLabel>Language</InputLabel>
              <Select
                multiple
                value={language}
                // onChange={handleLanguageChange}
                input={<OutlinedInput label="Language" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    <Checkbox checked={language.indexOf(lang) > -1} />
                    <ListItemText primary={lang} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={2}>
            <Typography
              align="left"
              sx={{ fontWeight: "bold", paddingRight: 2 }}
            >
              Match Timeout
            </Typography>
          </Grid2>

          <Grid2 size={10}>
            <TextField
              fullWidth
              label="Match Timeout"
              type="number"
              value={timeout}
              onChange={handleTimeoutChange}
              InputProps={{
                inputProps: { min: 1, max: 30 },
              }}
              helperText="Set a timeout between 1 to 30 minutes"
              sx={{
                backgroundColor: "white",
                "& .MuiFormHelperText-root": {
                  margin: "0px",
                  backgroundColor: "#F5F5F5",
                },
              }}
            />
          </Grid2>
        </Grid2>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Find my match!
        </Button>
      </Card>
    </AppMargin>
  );
};

export default Home;
