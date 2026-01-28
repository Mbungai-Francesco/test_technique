import axios from "axios";
import { config, link } from ".";
import type { AuthResponse , LoginDto,  RegisterDto, User} from "@/types";

const route = "auth";

// Register a new user
export const register = async (registerDto: RegisterDto) => {
  try {
    const res = await axios.post(`${link}/${route}/register`, registerDto);
    console.log("message", res.statusText);
    return res.data as AuthResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Login user
export const login = async (loginDto: LoginDto) => {
  try {
    const res = await axios.post(`${link}/${route}/login`, loginDto);
    console.log("message", res.statusText);
    return res.data as AuthResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get current user profile
export const getProfile = async (jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}/profile`, config(jwt));
    console.log("message", res.statusText);
    return res.data as User;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
