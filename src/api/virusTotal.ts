import axios from "axios";
import { config, link} from ".";

const route = "virus-scan"

// Check virus report for an application
export const checkVirusReport = async (applicationId: string, jwt: string) => {
  try {
    const res = await axios.post(`${link}/${route}/check-report/${applicationId}`, {}, config(jwt));
    console.log("message", res.statusText);
    return "success";
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
