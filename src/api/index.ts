export const link = import.meta.env.BACKEND || "http://localhost:3000";

export const config = (jwt: string) =>{
    return {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    }
}