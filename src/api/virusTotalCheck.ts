import { api, link } from ".";
import type { VirusScanResponse, VirusTotalCheckDto, VirusTotalCheckUpdateDto } from "@/types";

const route = "virus-check"

// Create a new virus check
export const createVirusCheck = async (virusCheck: VirusTotalCheckDto) => {
  try {
    const res = await api.post(`${link}/${route}`, virusCheck);
    console.log("message", res.statusText);
    return res.data as VirusScanResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get all virus checks
export const getAllVirusChecks = async () => {
  try {
    const res = await api.get(`${link}/${route}`);
    console.log("message", res.statusText);
    return res.data as Array<VirusScanResponse>;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get a single virus check by ID
export const getVirusCheckById = async (id: string) => {
  try {
    const res = await api.get(`${link}/${route}/${id}`);
    console.log("message", res.statusText);
    return res.data as VirusScanResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get virus checks by application ID
export const getVirusChecksByApplication = async (applicationId: string) => {
  try {
    const res = await api.get(`${link}/${route}/application/${applicationId}`);
    console.log("message", res.statusText);
    return res.data as Array<VirusScanResponse>;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get virus check by permalink
export const getVirusCheckByPermalink = async (permalink: string) => {
  try {
    const res = await api.get(`${link}/${route}/permalink/${permalink}`);
    console.log("message", res.statusText);
    return res.data as VirusScanResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Get latest virus check by application ID
export const getLatestVirusCheckByApplication = async (applicationId: string) => {
  try {
    const res = await api.get(`${link}/${route}/application/${applicationId}/latest`);
    console.log("message", res.statusText);
    return res.data as VirusScanResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update a virus check
export const updateVirusCheck = async (id: string, virusCheck: Partial<VirusTotalCheckUpdateDto>) => {
  try {
    const res = await api.patch(`${link}/${route}/${id}`, virusCheck);
    console.log("message", res.statusText);
    return res.data as VirusScanResponse;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Delete a virus check by ID
export const deleteVirusCheck = async (id: string) => {
  try {
    const res = await api.delete(`${link}/${route}/${id}`);
    console.log("message", res.statusText);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

// Delete all virus checks by application ID
export const deleteVirusChecksByApplication = async (applicationId: string) => {
  try {
    const res = await api.delete(`${link}/${route}/application/${applicationId}`);
    console.log("message", res.statusText);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
