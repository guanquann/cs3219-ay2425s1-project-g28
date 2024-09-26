import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  FormControl,
  Grid2,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

import classes from "./index.module.css";
import AppMargin from "../../components/AppMargin";
import {
  complexityList,
  languageList,
  maxMatchTimeout,
  minMatchTimeout,
} from "../../utils/constants";

const Home: React.FC = () => {
  const [complexity, setComplexity] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [language, setLanguage] = useState<string[]>([]);
  const [timeout, setTimeout] = useState<number>(30);

  //   useEffect(() => {
  //     // Fetch categories from the backend
  //     getCategories().then((res) => setCategories(res));
  //   }, []);

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const {
      target: { value },
    } = event;
    // setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
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
              <Select
                multiple
                value={complexity}
                onChange={(event) =>
                  setComplexity(event.target.value as string[])
                }
                renderValue={(selected) =>
                  selected.map((value) => {
                    return (
                      <Chip
                        size="medium"
                        label={value}
                        key={value}
                        deleteIcon={
                          <CloseIcon
                            onMouseDown={(event: any) =>
                              event.stopPropagation()
                            }
                          />
                        }
                        onDelete={() => {
                          setComplexity((prev) =>
                            prev.filter((v) => v != value)
                          );
                        }}
                        sx={(theme) => ({
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                          marginRight: theme.spacing(1),
                          "& .MuiChip-deleteIcon": {
                            color: "primary.contrastText",
                          },
                        })}
                      />
                    );
                  })
                }
              >
                {complexityList.map((comp) => (
                  <MenuItem key={comp} value={comp}>
                    <Checkbox checked={complexity.indexOf(comp) > -1} />
                    <ListItemText primary={comp} />
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
              Category
            </Typography>
          </Grid2>

          <Grid2 size={10}>
            <FormControl
              fullWidth
              sx={{ marginBottom: 2, backgroundColor: "white" }}
            >
              <Select
                multiple
                value={selectedCategories}
                // onChange={handleCategoryChange}
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
              <Select
                multiple
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as string[])
                }
                renderValue={(selected) =>
                  selected.map((value) => {
                    return (
                      <Chip
                        size="medium"
                        label={value}
                        key={value}
                        deleteIcon={
                          <CloseIcon
                            onMouseDown={(event: any) =>
                              event.stopPropagation()
                            }
                          />
                        }
                        onDelete={() => {
                          setLanguage((prev) => prev.filter((v) => v != value));
                        }}
                        sx={(theme) => ({
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                          marginRight: theme.spacing(1),
                          "& .MuiChip-deleteIcon": {
                            color: "primary.contrastText",
                          },
                        })}
                      />
                    );
                  })
                }
              >
                {languageList.map((lang) => (
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
              type="number"
              value={timeout}
              onChange={(event) => {
                const value = parseInt(event.target.value, 10);
                setTimeout(value);
              }}
              InputProps={{
                inputProps: { min: minMatchTimeout, max: maxMatchTimeout },
              }}
              helperText={`Set a timeout between ${minMatchTimeout} to ${maxMatchTimeout} seconds`}
              error={isNaN(timeout) || timeout < minMatchTimeout || timeout > maxMatchTimeout}
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
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          disabled={isNaN(timeout) || timeout < minMatchTimeout || timeout > maxMatchTimeout}
        >
          Find my match!
        </Button>
      </Card>
    </AppMargin>
  );
};

export default Home;
