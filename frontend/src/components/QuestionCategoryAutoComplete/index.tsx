import { Autocomplete, Chip, TextField } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { categoryList } from "../../utils/constants";

interface QuestionCategoryAutoCompleteProps {
  selectedCategories?: string[];
  setSelectedCategories: (value: string[]) => void;
}

const QuestionCategoryAutoComplete: React.FC<QuestionCategoryAutoCompleteProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  // TODO
  // Fetch category list from the server

  const filter = createFilterOptions<string>();

  return (
    <Autocomplete
      multiple
      freeSolo
      options={categoryList}
      size="small"
      sx={{ marginTop: 2 }}
      value={selectedCategories}
      onChange={(e, newCategoriesSelected) => {
        const newValue = newCategoriesSelected[newCategoriesSelected.length - 1];
        if (typeof newValue === "string" && newValue.startsWith(`Add: "`)) {
          categoryList.push(newValue.slice(6, -1));
          setSelectedCategories([...newCategoriesSelected.slice(0, -1), newValue.slice(6, -1)]);
        } else {
          setSelectedCategories(newCategoriesSelected);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;

        const isExisting = options.some((option) => inputValue === option);

        if (inputValue !== "" && !isExisting) {
          filtered.push(`Add: "${inputValue}"`);
        }

        return filtered;
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              size="small"
              label={
                typeof option === "string" && option.startsWith(`Add: "`)
                  ? option.slice(6, -1)
                  : option
              }
              key={key}
              {...tagProps}
            />
          );
        })
      }
      renderInput={(params) => <TextField {...params} label="Category" />}
    />
  );
};

export default QuestionCategoryAutoComplete;
