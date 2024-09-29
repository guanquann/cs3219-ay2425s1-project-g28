import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as hooks from "../../contexts/AuthContext";
import SignUp from ".";
import { userClient } from "../../utils/api";

/* Mock useNavigate */
const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
}));

/* Mock userClient APIs */
jest.mock("../../utils/api", () => ({
  userClient: {
    post: jest.fn(),
  },
}));
const mockedPost = userClient.post as jest.MockedFunction<typeof userClient.post>;

describe("Sign Up Components", () => {
  beforeEach(() => {
    jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
    }));
  });

  it("App name is rendered", () => {
    render(<SignUp />);
    expect(screen.getByText("PeerPrep")).toBeInTheDocument();
  });

  it("First name field is rendered", () => {
    render(<SignUp />);
    expect(screen.getByTestId("First Name")).toBeInTheDocument();
  });

  it("Last name field is rendered", () => {
    render(<SignUp />);
    expect(screen.getByTestId("Last Name")).toBeInTheDocument();
  });

  it("Username field is rendered", () => {
    render(<SignUp />);
    expect(screen.getByTestId("Username")).toBeInTheDocument();
  });

  it("Email field is rendered", () => {
    render(<SignUp />);
    expect(screen.getByTestId("Email")).toBeInTheDocument();
  });

  it("Password field is rendered", () => {
    render(<SignUp />);
    expect(screen.getByTestId("Password")).toBeInTheDocument();
  });

  it("Sign up button is rendered", () => {
    render(<SignUp />);
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("Prompt to log in is rendered", () => {
    render(<SignUp />);
    const logInButton = screen.getByRole("button", { name: "Log in" });
    expect(logInButton).toBeInTheDocument();

    fireEvent.click(logInButton);
    expect(mockUseNavigate).toHaveBeenCalledWith("/login");
  });
});

describe("Sign Up Events", () => {
  // valid inputs
  const firstName = "Test First Name";
  const lastName = "Test Last Name";
  const username = ".test_username";
  const email = "test@gmail.com";
  const password = "Password@123";

  beforeEach(() => {
    jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
      signup: (firstName, lastName, username, email, password) => {
        return mockedPost("/users", {
          firstName,
          lastName,
          username,
          email,
          password,
        });
      },
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
    }));
  });

  it("Successful sign up with valid inputs", async () => {
    mockedPost.mockResolvedValue({});

    render(<SignUp />);

    fireEvent.change(screen.getByTestId("First Name"), { target: { value: firstName } });
    fireEvent.change(screen.getByTestId("Last Name"), { target: { value: lastName } });
    fireEvent.change(screen.getByTestId("Username"), { target: { value: username } });
    fireEvent.change(screen.getByTestId("Email"), { target: { value: email } });
    fireEvent.change(screen.getByTestId("Password"), { target: { value: password } });
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith("/users", {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
      });
    });
  });

  it("Unsuccessful sign up with invalid username", async () => {
    const invalidUsername = "test";

    render(<SignUp />);

    fireEvent.change(screen.getByTestId("First Name"), { target: { value: firstName } });
    fireEvent.change(screen.getByTestId("Last Name"), { target: { value: lastName } });
    fireEvent.change(screen.getByTestId("Username"), { target: { value: invalidUsername } });
    fireEvent.change(screen.getByTestId("Email"), { target: { value: email } });
    fireEvent.change(screen.getByTestId("Password"), { target: { value: password } });
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(mockedPost).not.toHaveBeenCalled();
    });
  });

  it("Unsuccessful sign up with invalid email", async () => {
    const invalidEmail = "invalidEmail";

    render(<SignUp />);

    fireEvent.change(screen.getByTestId("First Name"), { target: { value: firstName } });
    fireEvent.change(screen.getByTestId("Last Name"), { target: { value: lastName } });
    fireEvent.change(screen.getByTestId("Username"), { target: { value: username } });
    fireEvent.change(screen.getByTestId("Email"), { target: { value: invalidEmail } });
    fireEvent.change(screen.getByTestId("Password"), { target: { value: password } });
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(mockedPost).not.toHaveBeenCalled();
    });
  });

  it("Unsuccessful sign up with invalid password", async () => {
    const invalidPassword = "invalidPassword";

    render(<SignUp />);

    fireEvent.change(screen.getByTestId("First Name"), { target: { value: firstName } });
    fireEvent.change(screen.getByTestId("Last Name"), { target: { value: lastName } });
    fireEvent.change(screen.getByTestId("Username"), { target: { value: username } });
    fireEvent.change(screen.getByTestId("Email"), { target: { value: email } });
    fireEvent.change(screen.getByTestId("Password"), { target: { value: invalidPassword } });
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(mockedPost).not.toHaveBeenCalled();
    });
  });
});
