const link = import.meta.env.BACKEND || "http://localhost:3000";

const VIRUSTOTAL_URL = import.meta.env.VIRUSTOTAL_URL;
const VIRUSTOTAL_API_KEY = import.meta.env.VIRUSTOTAL_API_KEY;

export { link, VIRUSTOTAL_URL, VIRUSTOTAL_API_KEY };

export const config = (jwt: string) =>{
    return {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    }
}