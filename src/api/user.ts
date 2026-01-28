import axios from "axios";
import { config, link } from ".";
import type { User, UserUpdateDto } from "@/types";

const route = "users";

// Get all users
export const getAllUsers = async (jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}`, config(jwt));
    console.log("message", res.statusText);
    return res.data as Array<User>;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get a single user by ID
export const getUserById = async (id: string, jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}/${id}`, config(jwt));
    console.log("message", res.statusText);
    return res.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update a user
export const updateUser = async (id: string, user: Partial<UserUpdateDto>, jwt: string) => {
  try {
    const res = await axios.patch(`${link}/${route}/${id}`, user, config(jwt));
    console.log("message", res.statusText);
    return res.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Delete a user by ID
export const deleteUser = async (id: string, jwt: string) => {
  try {
    const res = await axios.delete(`${link}/${route}/${id}`, config(jwt));
    console.log("message", res.statusText);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
