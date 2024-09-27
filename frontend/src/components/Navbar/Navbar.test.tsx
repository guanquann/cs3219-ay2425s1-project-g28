import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { faker } from "@faker-js/faker";
import * as hooks from "../../contexts/AuthContext";
import Navbar from ".";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate(),
}));

describe("Navigation routes", () => {
  it("Question route is present", () => {
    const username = faker.internet.userName();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const biography = faker.person.bio();
    const profilePictureUrl = "";
    const createdAt = "";
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          id: "1",
          username,
          firstName,
          lastName,
          email,
          biography,
          profilePictureUrl,
          createdAt,
        },
      },
    });
    jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      user: {
        id: "1",
        username,
        firstName,
        lastName,
        email,
        profilePictureUrl,
        biography,
        createdAt,
      },
    }));
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Questions" })).toBeInTheDocument();
  });
});

describe("Unauthenticated user", () => {
  it("Sign up button is rendered", () => {
    mockedAxios.get.mockResolvedValue({ data: { data: null } });
    jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
    }));
    render(<Navbar />);
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("Login button is rendered", () => {
    mockedAxios.get.mockResolvedValue({ data: { data: null } });
    jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
    }));
    render(<Navbar />);
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });
});

describe("Authenticated user", () => {
  it("Avatar is rendered", () => {
    const username = faker.internet.userName();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const biography = faker.person.bio();
    const profilePictureUrl = "";
    const createdAt = "";
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          id: "1",
          username,
          firstName,
          lastName,
          email,
          biography,
          profilePictureUrl,
          createdAt,
        },
      },
    });
    jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      user: {
        id: "1",
        username,
        firstName,
        lastName,
        email,
        profilePictureUrl,
        biography,
        createdAt,
      },
    }));
    render(<Navbar />);
    expect(screen.getByTestId("profile")).toBeInTheDocument();
  });

  it("Profile button is rendered", () => {
    const username = faker.internet.userName();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const biography = faker.person.bio();
    const profilePictureUrl = "";
    const createdAt = "";
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          id: "1",
          username,
          firstName,
          lastName,
          email,
          biography,
          profilePictureUrl,
          createdAt,
        },
      },
    });
    jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      user: {
        id: "1",
        username,
        firstName,
        lastName,
        email,
        profilePictureUrl,
        biography,
        createdAt,
      },
    }));
    render(<Navbar />);
    const avatar = screen.getByTestId("profile");
    fireEvent.click(avatar);
    expect(
      screen.getByRole("menuitem", { name: "Profile" })
    ).toBeInTheDocument();
  });

  it("Redirects user to the profile page", () => {
    const username = faker.internet.userName();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const biography = faker.person.bio();
    const profilePictureUrl = "";
    const createdAt = "";
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          id: "1",
          username,
          firstName,
          lastName,
          email,
          biography,
          profilePictureUrl,
          createdAt,
        },
      },
    });
    jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      user: {
        id: "1",
        username,
        firstName,
        lastName,
        email,
        profilePictureUrl,
        biography,
        createdAt,
      },
    }));
    render(<Navbar />);
    const avatar = screen.getByTestId("profile");
    fireEvent.click(avatar);
    expect(mockUseNavigate).toHaveBeenCalled();
  });

  it("Logout button is rendered", () => {
    const username = faker.internet.userName();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const biography = faker.person.bio();
    const profilePictureUrl = "";
    const createdAt = "";
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          id: "1",
          username,
          firstName,
          lastName,
          email,
          biography,
          profilePictureUrl,
          createdAt,
        },
      },
    });
    jest.spyOn(hooks, "useAuth").mockImplementation(() => ({
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      user: {
        id: "1",
        username,
        firstName,
        lastName,
        email,
        profilePictureUrl,
        biography,
        createdAt,
      },
    }));
    render(<Navbar />);
    const avatar = screen.getByTestId("profile");
    fireEvent.click(avatar);
    expect(
      screen.getByRole("menuitem", { name: "Logout" })
    ).toBeInTheDocument();
  });
});
