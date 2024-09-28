import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import QuestionCategoryAutoComplete from ".";

describe("Question Category Auto Complete", () => {
  const selectedCategories: string[] = ["DFS"];
  const setSelectedCategories = jest.fn();

  it("Question Category Auto Complete is rendered", () => {
    render(
      <QuestionCategoryAutoComplete
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    );

    const category = screen.getByText("DFS");

    expect(category).toBeInTheDocument();
  });

  it("Adding a new category from the category list", () => {
    render(
      <QuestionCategoryAutoComplete
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    );

    const input = screen.getByLabelText("Category");
    fireEvent.change(input, { target: { value: "Strings" } });

    expect(screen.getByText("Strings")).toBeInTheDocument();
  });

  it("Adding a new category not from the category list", () => {
    const { rerender } = render(
      <QuestionCategoryAutoComplete
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    );

    const input = screen.getByLabelText("Category");
    fireEvent.change(input, { target: { value: "New Category" } });

    const valueAdded = 'Add: "New Category"';
    expect(screen.getByText(valueAdded)).toBeInTheDocument();

    fireEvent.click(screen.getByText(valueAdded));

    const updatedCategories = [...selectedCategories, "New Category"];

    rerender(
      <QuestionCategoryAutoComplete
        selectedCategories={updatedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    );

    expect(screen.getByText("New Category")).toBeInTheDocument();
  });

  it("Remove a category from selected categories", () => {
    render(
      <QuestionCategoryAutoComplete
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    );

    const deleteButton = screen.getByTestId("CancelIcon");
    fireEvent.click(deleteButton);

    expect(setSelectedCategories).toHaveBeenCalledWith([]);
  });
});
