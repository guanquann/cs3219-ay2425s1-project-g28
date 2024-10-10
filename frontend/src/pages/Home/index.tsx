import {
  Autocomplete,
  Box,
  Button,
  Card,
  FormControl,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useReducer, useState } from "react";

import classes from "./index.module.css";
import AppMargin from "../../components/AppMargin";
import {
  complexityList,
  languageList,
  maxMatchTimeout,
  minMatchTimeout,
  USE_AUTH_ERROR_MESSAGE,
} from "../../utils/constants";
import reducer, {
  getQuestionCategories,
  initialState,
} from "../../reducers/questionReducer";
import CustomChip from "../../components/CustomChip";
import homepageImage from "/homepage_image.svg";
import { io } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";

const Home: React.FC = () => {
  const [complexity, setComplexity] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [language, setLanguage] = useState<string[]>([]);
  const [timeout, setTimeout] = useState<number>(30);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getQuestionCategories(dispatch);
  }, []);

  const auth = useAuth();
  if (!auth) {
    throw new Error(USE_AUTH_ERROR_MESSAGE);
  }
  const { user } = auth; // TODO: if (!user)

  const handleFindMatch = () => {
    const socket = io("http://localhost:3002/matching");

    // TODO: pass socket to matching pages for stop matching button
    // socket.disconnect();

    // socket.on("connect", () => {
    //   console.log("Socket connected");
    // });

    socket.emit("match_request", {
      user: user!.id,
      complexities: complexity,
      categories: selectedCategories,
      languages: language,
      timeout: timeout,
    });

    socket.on("match_found", (partner) => {
      console.log(`Potential match partner: ${partner}`);
      // TODO: the user may accept / decline the match
      // socket.emit("match_accepted");
      // socket.emit("match_declined");
    });

    socket.on("match_successful", (partner) => {
      console.log(`Successful match partner: ${partner}`);
      socket.disconnect();
    });

    socket.on("match_unsuccessful", () => {
      console.log("Match unsuccessful");
      socket.disconnect();
    });

    socket.on("match_timeout", () => {
      console.log("Match timeout");
      socket.disconnect();
    });

    socket.on("disconnect", () => {
      console.log("Oops, something went wrong");
    });
  };

  return (
    <AppMargin
      classname={`${classes.fullheight} ${classes.center} ${classes.margins}`}
    >
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
        Start an interactive practice session today!
      </Typography>

      <Typography
        variant="subtitle1"
        textAlign={"center"}
        sx={(theme) => ({
          fontSize: "h5.fontSize",
          marginBottom: theme.spacing(4),
          maxWidth: "80%",
        })}
      >
        Specify your question preferences and sit back as we find you the best
        match.
      </Typography>
      <Box
        component="img"
        src={homepageImage}
        alt="Interview Practice Buddy"
        sx={{
          position: "absolute",
          top: "35%",
          left: "10%",
          width: "128px",
          height: "auto",
          objectFit: "contain",
        }}
      />
      <Card
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Grid2 container rowSpacing={2} columnSpacing={2} alignItems="center">
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
              required={true}
              sx={{ backgroundColor: "white" }}
            >
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={complexityList}
                onChange={(_, selectedOptions) => {
                  setComplexity(selectedOptions);
                }}
                renderInput={(params) => <TextField {...params} />}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => {
                    const tagProps = getTagProps({ index });

                    return (
                      <CustomChip
                        label={option}
                        key={option}
                        onDelete={tagProps.onDelete}
                      />
                    );
                  })
                }
              />
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
              required={true}
              sx={{ backgroundColor: "white" }}
            >
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={state.questionCategories}
                onChange={(_, selectedOptions) => {
                  setSelectedCategories(selectedOptions);
                }}
                renderInput={(params) => <TextField {...params} />}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => {
                    const tagProps = getTagProps({ index });

                    return (
                      <CustomChip
                        label={option}
                        key={option}
                        onDelete={tagProps.onDelete}
                      />
                    );
                  })
                }
              />
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
              required={true}
              sx={{ backgroundColor: "white" }}
            >
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={languageList}
                onChange={(_, selectedOptions) => {
                  setLanguage(selectedOptions);
                }}
                renderInput={(params) => <TextField {...params} />}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => {
                    const tagProps = getTagProps({ index });

                    return (
                      <CustomChip
                        label={option}
                        key={option}
                        onDelete={tagProps.onDelete}
                      />
                    );
                  })
                }
              />
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
              required
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
              error={
                isNaN(timeout) ||
                timeout < minMatchTimeout ||
                timeout > maxMatchTimeout
              }
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
          // disabled={
          //   isNaN(timeout) ||
          //   timeout < minMatchTimeout ||
          //   timeout > maxMatchTimeout ||
          //   complexity.length == 0 ||
          //   selectedCategories.length == 0 ||
          //   language.length == 0
          // }
          onClick={() => {
            // alert(
            //   `${complexity}, ${selectedCategories}, ${language}, ${timeout}`
            // );
            handleFindMatch();
          }}
        >
          Find my match!
        </Button>
      </Card>
    </AppMargin>
  );
};

export default Home;
