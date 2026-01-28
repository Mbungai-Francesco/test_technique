import axios from "axios";
import { config, link } from ".";
import type { VirusScanResponse, VirusTotalCheckDto, VirusTotalCheckUpdateDto } from "@/types";

const route = "virus-check"

// Create a new virus check
export const createVirusCheck = async (virusCheck: VirusTotalCheckDto, jwt: string) => {
  try {
    const res = await axios.post(`${link}/${route}`, virusCheck, config(jwt));
    console.log("message", res.statusText);
    return res.data as VirusScanResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get all virus checks
export const getAllVirusChecks = async (jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}`, config(jwt));
    console.log("message", res.statusText);
    return res.data as Array<VirusScanResponse>;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get a single virus check by ID
export const getVirusCheckById = async (id: string, jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}/${id}`, config(jwt));
    console.log("message", res.statusText);
    return res.data as VirusScanResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get virus checks by application ID
export const getVirusChecksByApplication = async (applicationId: string, jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}/application/${applicationId}`, config(jwt));
    console.log("message", res.statusText);
    return res.data as Array<VirusScanResponse>;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get virus check by permalink
export const getVirusCheckByPermalink = async (permalink: string, jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}/permalink/${permalink}`, config(jwt));
    console.log("message", res.statusText);
    return res.data as VirusScanResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get latest virus check by application ID
export const getLatestVirusCheckByApplication = async (applicationId: string, jwt: string) => {
  try {
    const res = await axios.get(`${link}/${route}/application/${applicationId}/latest`, config(jwt));
    console.log("message", res.statusText);
    return res.data as VirusScanResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update a virus check
export const updateVirusCheck = async (id: string, virusCheck: Partial<VirusTotalCheckUpdateDto>, jwt: string) => {
  try {
    const res = await axios.patch(`${link}/${route}/${id}`, virusCheck, config(jwt));
    console.log("message", res.statusText);
    return res.data as VirusScanResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Delete a virus check by ID
export const deleteVirusCheck = async (id: string, jwt: string) => {
  try {
    const res = await axios.delete(`${link}/${route}/${id}`, config(jwt));
    console.log("message", res.statusText);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

// Delete all virus checks by application ID
export const deleteVirusChecksByApplication = async (applicationId: string, jwt: string) => {
  try {
    const res = await axios.delete(`${link}/${route}/application/${applicationId}`, config(jwt));
    console.log("message", res.statusText);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
