import axios from "axios";
import { config, link } from ".";
import type { Application, ApplicationCreateDto, ApplicationUpdateDto } from "@/types";

const route = "application";

export const createApp = async (app : ApplicationCreateDto, jwt: string) => {
  try{
    const res = await axios.post(`${link}/${route}`, app, config(jwt));
    console.log("message", res.statusText);
    return res.data as Application
  }
  catch(error){
    console.error('Error:', error);
    return null
  }
}

// Get all applications
export const getAllApps = async (jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}`, config(jwt));
    console.log("message", res.statusText);
    return res.data as Array<Application>;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get all applications by user ID
export const getAppsByUser = async (userId: string, jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}/user/${userId}`, config(jwt));
    console.log("message", res.statusText);
    return res.data as Array<Application>;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get a single application by ID
export const getAppById = async (id: string, jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}/${id}`, config(jwt));
    console.log("message", res.statusText);
    return res.data as Application;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Download application file
export const downloadAppFile = async (id: string, jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}/${id}/download`, {
      ...config(jwt),
      responseType: "blob",
    });
    console.log("message", res.statusText);
    return res.data as Blob;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update an application
export const updateApp = async (id: string, app: Partial<ApplicationUpdateDto>, jwt: string) => {
  try {
    const res = await axios.patch(`${link}/${route}/${id}`, app, config(jwt));
    console.log("message", res.statusText);
    return res.data as Application;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Delete an application by ID
export const deleteApp = async (id: string, jwt: string) => {
  try {
    const res = await axios.delete(`${link}/${route}/${id}`, config(jwt));
    console.log("message", res.statusText);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

// Delete all applications by user ID
export const deleteAppsByUser = async (userId: string, jwt: string) => {
  try {
    const res = await axios.delete(`${link}/${route}/user/${userId}`, config(jwt));
    console.log("message", res.statusText);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
