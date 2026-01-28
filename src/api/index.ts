import axios from "axios";

export const link = import.meta.env.BACKEND || "http://localhost:3000";

export const config = (jwt: string) =>{
    return {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    }
}

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // THIS IS THE KEY: It sends cookies with every request
});