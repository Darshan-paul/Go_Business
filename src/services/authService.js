import axios from "axios";

const LOGIN_API =
  "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(LOGIN_API, {
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", response.data);

    console.log("LOGIN RESPONSE:", response.data);
return response.data.data.token;
  } catch (error) {
    console.error(error);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Something went wrong. Please try again.");
  }
};