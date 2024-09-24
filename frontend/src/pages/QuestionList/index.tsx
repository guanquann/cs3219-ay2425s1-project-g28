import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid2,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import AppMargin from "../../components/AppMargin";
import { useNavigate } from "react-router-dom";
import reducer, {
  deleteQuestionById,
  getQuestionList,
  initialState,
} from "../../reducers/questionReducer";
import { categoryList, complexityList } from "../../utils/constants";
import useDebounce from "../../utils/debounce";
import { blue, grey } from "@mui/material/colors";
import { Add, Delete, Edit, MoreVert, Search } from "@mui/icons-material";

// TODO: get dynamic category list from DB

const tableHeaders = ["Title", "Complexity", "Categories"];
const searchCharacterLimit = 255;
const categorySelectionLimit = 10;
const rowsPerPage = 10;
const isAdmin = false; // TODO: check using auth context

const QuestionList: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchFilter, setSearchFilter] = useDebounce<string>("", 1000);
  const [complexityFilter, setComplexityFilter] = useDebounce<string[]>([], 1000);
  const [categoryFilter, setCategoryFilter] = useDebounce<string[]>([], 1000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const theme = useTheme();

  // For handling edit / delete question for the admin user
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleQuestionDelete = (questionId: string) => {
    // TODO
    // handleMenuClose();
    deleteQuestionById(questionId, dispatch);
  };

  useEffect(() => {
    getQuestionList(
      page,
      rowsPerPage,
      searchFilter,
      complexityFilter,
      categoryFilter,
      dispatch
    );
  }, [page, searchFilter, complexityFilter, categoryFilter]);

  return (
    <AppMargin>
      <Box sx={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(4) }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography component="h1" variant="h3">
            Questions
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              disableElevation
              startIcon={<Add />}
              sx={{ height: 40 }}
              onClick={() => navigate("new")}
            >
              Create
            </Button>
          )}
        </Stack>
        <Grid2
          container
          rowSpacing={1}
          columnSpacing={2}
          sx={{
            marginTop: theme.spacing(2),
            "& fieldset": { borderRadius: theme.spacing(2.5) },
            "& .MuiTextField-root": { width: "100%" },
          }}
        >
          <Grid2 size={12}>
            <TextField
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="button">
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  maxLength: searchCharacterLimit,
                },
                formHelperText: {
                  sx: { textAlign: "right" },
                },
              }}
              label="Title"
              onChange={(input) => {
                setSearchInput(input.target.value);
                setSearchFilter(input.target.value);
              }}
              helperText={
                searchInput.length + ` / ${searchCharacterLimit} characters`
              }
              disabled={state.questions.length === 0}
            />
          </Grid2>
          <Grid2 size={4}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={complexityList}
              onChange={(_, selectedOptions) => {
                setComplexityFilter(selectedOptions);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Complexity" />
              )}
              disabled={state.questions.length === 0}
            />
          </Grid2>
          <Grid2 size={8}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={categoryList}
              getOptionDisabled={(option) =>
                selectedCategories.length > categorySelectionLimit &&
                !selectedCategories.includes(option as string)
              }
              onChange={(_, selectedOptions) => {
                setSelectedCategories(selectedOptions);
                setCategoryFilter(selectedOptions);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  helperText={
                    selectedCategories.length +
                    ` / ${categorySelectionLimit} selections`
                  }
                  slotProps={{
                    formHelperText: {
                      sx: { textAlign: "right" },
                    },
                  }}
                />
              )}
              disabled={state.questions.length === 0}
            />
          </Grid2>
        </Grid2>
        <TableContainer>
          <Table
            sx={{
              "& .MuiTableCell-root": { padding: theme.spacing(1.2) },
              whiteSpace: "nowrap",
            }}
          >
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell key={header}>
                    <Typography component="span" variant="h5">
                      {header}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {state.questions.slice(0, rowsPerPage).map((question) => (
                <TableRow key={question.questionId}>
                  <TableCell
                    sx={{
                      width: "50%",
                      maxWidth: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        "&:hover": { cursor: "pointer", color: "primary.main" },
                      }}
                      onClick={() => navigate(`${question.questionId}`)}
                    >
                      {question.title}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderLeft: "1px solid #E0E0E0",
                      borderRight: "1px solid #E0E0E0",
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color:
                          question.complexity === "Easy"
                            ? "success.main"
                            : question.complexity === "Medium"
                            ? "#D2C350"
                            : question.complexity === "Hard"
                            ? "error.main"
                            : grey[500],
                      }}
                    >
                      {question.complexity}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "50%",
                      maxWidth: "250px",
                      overflow: "auto",
                    }}
                  >
                    <Stack direction="row">
                      {question.categories.map((category) => (
                        <Chip
                          key={category}
                          label={category}
                          color="primary"
                          sx={{
                            marginLeft: theme.spacing(0.5),
                            marginRight: theme.spacing(0.5),
                          }}
                        />
                      ))}
                      <Chip
                        sx={{ visibility: "hidden", width: theme.spacing(0.5) }}
                      />
                    </Stack>
                  </TableCell>
                  {isAdmin && (
                    <TableCell sx={{ borderTop: "1px solid #E0E0E0" }}>
                      <IconButton type="button" onClick={handleMenuOpen}>
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() =>
                            navigate(`${question.questionId}/edit`)
                          }
                        >
                          <ListItemIcon>
                            <Edit
                              sx={{ fontSize: "large", color: blue[800] }}
                            />
                          </ListItemIcon>
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleQuestionDelete(question.questionId)
                          }
                        >
                          <ListItemIcon>
                            <Delete
                              sx={{ fontSize: "large", color: "error.main" }}
                            />
                          </ListItemIcon>
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[rowsPerPage]}
          component="div"
          count={state.questionCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, page) => setPage(page)}
        />
        {state.questions.length === 0 && (
          <Stack
            direction="column"
            spacing={1}
            sx={{ alignItems: "center", fontStyle: "italic" }}
          >
            <Typography>
              Unfortunately, there are no questions available now.
            </Typography>
            <Typography>
              {isAdmin
                ? "Create questions using the 'Create' button above."
                : "Please try again later!"}
            </Typography>
          </Stack>
        )}
      </Box>
    </AppMargin>
  );
};

export default QuestionList;
