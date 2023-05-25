import axios from "axios";

export const login = async (name: string, email: string) => {
  try {
    const response = await axios.post(
      "https://frontend-take-home-service.fetch.com/auth/login",
      { name, email },
      { withCredentials: true }
    );
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.post(
      "https://frontend-take-home-service.fetch.com/auth/logout",null,
      { withCredentials: true }
    );
  } catch (error) {
    throw error;
  }
};
