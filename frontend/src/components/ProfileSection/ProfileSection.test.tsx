import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { faker } from "@faker-js/faker";

import ProfileSection from ".";

faker.seed(0);

describe("Profile section", () => {
  it("First name and last name is rendered", () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.userName();
    const biography = faker.person.bio();
    const isCurrentUser = false;
    const handleEditProfileOpen = jest.fn();
    const handleChangePasswordOpen = jest.fn();
    render(
      <ProfileSection
        firstName={firstName}
        lastName={lastName}
        username={username}
        biography={biography}
        isCurrentUser={isCurrentUser}
        handleEditProfileOpen={handleEditProfileOpen}
        handleChangePasswordOpen={handleChangePasswordOpen}
      />,
    );
    expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument();
  });

  it("Username is rendered", () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.userName();
    const biography = faker.person.bio();
    const isCurrentUser = false;
    const handleEditProfileOpen = jest.fn();
    const handleChangePasswordOpen = jest.fn();
    render(
      <ProfileSection
        firstName={firstName}
        lastName={lastName}
        username={username}
        biography={biography}
        isCurrentUser={isCurrentUser}
        handleEditProfileOpen={handleEditProfileOpen}
        handleChangePasswordOpen={handleChangePasswordOpen}
      />,
    );
    expect(screen.getByText(`@${username}`)).toBeInTheDocument();
  });
});

describe("Profiles that don't belong to the current authenticated user", () => {
  it("Edit profile button is absent", () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.userName();
    const biography = faker.person.bio();
    const isCurrentUser = false;
    const handleEditProfileOpen = jest.fn();
    const handleChangePasswordOpen = jest.fn();
    render(
      <ProfileSection
        firstName={firstName}
        lastName={lastName}
        username={username}
        biography={biography}
        isCurrentUser={isCurrentUser}
        handleEditProfileOpen={handleEditProfileOpen}
        handleChangePasswordOpen={handleChangePasswordOpen}
      />,
    );
    const editProfileButton = screen.queryByRole("button", {
      name: "Edit profile",
    });
    expect(editProfileButton).not.toBeInTheDocument();
  });

  it("Edit password button is absent", () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.userName();
    const biography = faker.person.bio();
    const isCurrentUser = false;
    const handleEditProfileOpen = jest.fn();
    const handleChangePasswordOpen = jest.fn();
    render(
      <ProfileSection
        firstName={firstName}
        lastName={lastName}
        username={username}
        biography={biography}
        isCurrentUser={isCurrentUser}
        handleEditProfileOpen={handleEditProfileOpen}
        handleChangePasswordOpen={handleChangePasswordOpen}
      />,
    );
    const editProfileButton = screen.queryByRole("button", {
      name: "Edit password",
    });
    expect(editProfileButton).not.toBeInTheDocument();
  });
});

describe("Profiles that belong to the current authenticated user", () => {
  it("Edit profile button is present", () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.userName();
    const biography = faker.person.bio();
    const isCurrentUser = true;
    const handleEditProfileOpen = jest.fn();
    const handleChangePasswordOpen = jest.fn();
    render(
      <ProfileSection
        firstName={firstName}
        lastName={lastName}
        username={username}
        biography={biography}
        isCurrentUser={isCurrentUser}
        handleEditProfileOpen={handleEditProfileOpen}
        handleChangePasswordOpen={handleChangePasswordOpen}
      />,
    );
    const editProfileButton = screen.queryByRole("button", {
      name: "Edit profile",
    });
    expect(editProfileButton).toBeInTheDocument();
  });

  it("Edit password button is present", () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.userName();
    const biography = faker.person.bio();
    const isCurrentUser = true;
    const handleEditProfileOpen = jest.fn();
    const handleChangePasswordOpen = jest.fn();
    render(
      <ProfileSection
        firstName={firstName}
        lastName={lastName}
        username={username}
        biography={biography}
        isCurrentUser={isCurrentUser}
        handleEditProfileOpen={handleEditProfileOpen}
        handleChangePasswordOpen={handleChangePasswordOpen}
      />,
    );
    const editProfileButton = screen.getByRole("button", {
      name: "Change password",
    });
    expect(editProfileButton).toBeInTheDocument();
  });
});
