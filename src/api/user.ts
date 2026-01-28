import { api, link } from ".";
import type { User, UserUpdateDto } from "@/types";

const route = "users";

// Get all users
export const getAllUsers = async () => {
  try {
    const res = await api.get(`${link}/${route}`);
    console.log("message", res.statusText);
    return res.data as Array<User>;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get a single user by ID
export const getUserById = async (id: string) => {
  try {
    const res = await api.get(`${link}/${route}/${id}`);
    console.log("message", res.statusText);
    return res.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update a user
export const updateUser = async (id: string, user: Partial<UserUpdateDto>) => {
  try {
    const res = await api.patch(`${link}/${route}/${id}`, user);
    console.log("message", res.statusText);
    return res.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Delete a user by ID
export const deleteUser = async (id: string) => {
  try {
    const res = await api.delete(`${link}/${route}/${id}`);
    console.log("message", res.statusText);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
