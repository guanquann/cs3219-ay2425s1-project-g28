import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";
import {
  createUser as _createUser,
  deleteUserById as _deleteUserById,
  findAllUsers as _findAllUsers,
  findUserByEmail as _findUserByEmail,
  findUserById as _findUserById,
  findUserByUsername as _findUserByUsername,
  findUserByUsernameOrEmail as _findUserByUsernameOrEmail,
  updateUserById as _updateUserById,
  updateUserPrivilegeById as _updateUserPrivilegeById,
} from "../model/repository";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateName,
  validateBiography,
} from "../utils/validators";
import { IUser } from "../model/user-model";

export async function createUser(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { username, email, password } = req.body;
    const existingUser = await _findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "username or email already exists" });
    }

    if (username && email && password) {
      const { isValid: isValidUsername, message: usernameMessage } =
        validateUsername(username);
      if (!isValidUsername) {
        return res.status(400).json({ message: usernameMessage });
      }

      const { isValid: isValidEmail, message: emailMessage } =
        validateEmail(email);
      if (!isValidEmail) {
        return res.status(400).json({ message: emailMessage });
      }

      const { isValid: isValidPassword, message: passwordMessage } =
        validatePassword(password);
      if (!isValidPassword) {
        return res.status(400).json({ message: passwordMessage });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const createdUser = await _createUser(username, email, hashedPassword);
      return res.status(201).json({
        message: `Created new user ${username} successfully`,
        data: formatUserResponse(createdUser),
      });
    } else {
      return res
        .status(400)
        .json({ message: "username and/or email and/or password are missing" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when creating new user!" });
  }
}

export async function getUser(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    } else {
      return res
        .status(200)
        .json({ message: `Found user`, data: formatUserResponse(user) });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when getting user!" });
  }
}

export async function getAllUsers(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const users = await _findAllUsers();

    return res
      .status(200)
      .json({ message: `Found users`, data: users.map(formatUserResponse) });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when getting all users!" });
  }
}

export async function updateUser(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const {
      username,
      email,
      password,
      profilePictureUrl,
      firstName,
      lastName,
      biography,
    } = req.body;
    if (
      username ||
      email ||
      password ||
      profilePictureUrl ||
      firstName ||
      lastName ||
      biography
    ) {
      const userId = req.params.id;

      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      if (username) {
        const { isValid: isValidUsername, message: usernameMessage } =
          validateUsername(username);
        if (!isValidUsername) {
          return res.status(400).json({ message: usernameMessage });
        }

        const existingUser = await _findUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "username already exists" });
        }
      }

      if (email) {
        const { isValid: isValidEmail, message: emailMessage } =
          validateEmail(email);
        if (!isValidEmail) {
          return res.status(400).json({ message: emailMessage });
        }

        const existingUser = await _findUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "email already exists" });
        }
      }

      let hashedPassword: string | undefined;
      if (password) {
        const { isValid: isValidPassword, message: passwordMessage } =
          validatePassword(password);
        if (!isValidPassword) {
          return res.status(400).json({ message: passwordMessage });
        }

        const salt = bcrypt.genSaltSync(10);
        hashedPassword = bcrypt.hashSync(password, salt);
      }

      if (firstName) {
        const { isValid: isValidFirstName, message: firstNameMessage } =
          validateName(firstName, "first name");
        if (!isValidFirstName) {
          return res.status(400).json({ message: firstNameMessage });
        }
      }

      if (lastName) {
        const { isValid: isValidLastName, message: lastNameMessage } =
          validateName(lastName, "last name");
        if (!isValidLastName) {
          return res.status(400).json({ message: lastNameMessage });
        }
      }

      if (biography) {
        const { isValid: isValidBiography, message: biographyMessage } =
          validateBiography(biography);
        if (!isValidBiography) {
          return res.status(400).json({ message: biographyMessage });
        }
      }

      const updatedUser = await _updateUserById(
        userId,
        username,
        email,
        hashedPassword,
        profilePictureUrl,
        firstName,
        lastName,
        biography
      );
      return res.status(200).json({
        message: `Updated data for user ${userId}`,
        data: formatUserResponse(updatedUser as IUser),
      });
    } else {
      return res.status(400).json({
        message:
          "No field to update. Update one of the following fields: username, email, password, profilePictureUrl, firstName, lastName, biography",
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when updating user!" });
  }
}

export async function updateUserPrivilege(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { isAdmin } = req.body;

    if (isAdmin !== undefined) {
      // isAdmin can have boolean value true or false
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      const updatedUser = await _updateUserPrivilegeById(
        userId,
        isAdmin === true
      );
      return res.status(200).json({
        message: `Updated privilege for user ${userId}`,
        data: formatUserResponse(updatedUser as IUser),
      });
    } else {
      return res.status(400).json({ message: "isAdmin is missing!" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when updating user privilege!" });
  }
}

export async function deleteUser(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    await _deleteUserById(userId);
    return res
      .status(200)
      .json({ message: `Deleted user ${userId} successfully` });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when deleting user!" });
  }
}

export function formatUserResponse(user: IUser) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,

    profilePictureUrl: user.profilePictureUrl,
    firstName: user.firstName,
    lastName: user.lastName,
    biography: user.biography,
  };
}
