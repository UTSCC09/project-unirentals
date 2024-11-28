import axios from "axios";
const API_BASE_URL = "http://127.0.0.1:8000"; // replace with API URL

interface SignUpResponse {
  success: boolean;
  message: string;
}

interface SignInResponse {
  success: boolean;
  message: string;
  token?: string;
}

interface SignOutResponse {
  success: boolean;
  message: string;
}

let csrfToken: string | null = null;

// Fetch CSRF token on app startup
export const fetchCSRFToken = async (): Promise<void> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/getcsrf/`);
    csrfToken = response.data.csrfToken;
    console.log("CSRF token:", csrfToken);
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
  }
};

// sign up
export const signUp = async (formData: FormData): Promise<SignUpResponse> => {
  console.log("signUp: ", formData);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/register/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Csrftoken": csrfToken || "",
        },
      }
    );

    return { success: response.status === 201, message: response.data.message };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to sign up" };
  }
};

// sign in
export const signIn = async (
formData: FormData
): Promise<SignInResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/login/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Csrftoken": csrfToken || "",
        },
      }
    );

    return {
      success: response.status === 200,
      message: response.data.message,
      token: response.data.token,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to sign in" };
  }
};

// sign out
export const signOut = async (): Promise<SignOutResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/logout/`, {
      headers: {
        "X-Csrftoken": csrfToken || "",
      },
    });

    return {
      success: response.status === 200,
      message: response.data.message,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to sign out" };
  }
};

