import { api, link } from ".";

const route = "virus-scan"

// Check virus report for an application
export const checkVirusReport = async (applicationId: string) => {
  try {
    const res = await api.post(`${link}/${route}/check-report/${applicationId}`, {});
    console.log("message", res.statusText);
    return "success";
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
