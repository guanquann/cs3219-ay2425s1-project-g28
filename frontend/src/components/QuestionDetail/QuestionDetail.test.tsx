import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import QuestionDetail from ".";

describe("Question details", () => {
  it("Question title is rendered", () => {
    const title = "Test title";
    const complexity = "Easy";
    const categories = ["Algorithms", "Data Structures"];
    const description = "# Test description";
    render(
      <QuestionDetail
        title={title}
        complexity={complexity}
        categories={categories}
        description={description}
      />
    );
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("Question complexity is rendered", () => {
    const title = "Test title";
    const complexity = "Easy";
    const categories = ["Algorithms", "Data Structures"];
    const description = "# Test description";
    render(
      <QuestionDetail
        title={title}
        complexity={complexity}
        categories={categories}
        description={description}
      />
    );
    expect(screen.getByText(complexity)).toBeInTheDocument();
  });

  it("Question categories are rendered", () => {
    const title = "Test title";
    const complexity = "Easy";
    const categories = ["Algorithms", "Data Structures"];
    const description = "# Test description";
    render(
      <QuestionDetail
        title={title}
        complexity={complexity}
        categories={categories}
        description={description}
      />
    );
    expect(screen.getByText(categories[0])).toBeInTheDocument();
    expect(screen.getByText(categories[1])).toBeInTheDocument();
  });
});
