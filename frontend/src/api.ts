const API_BASE_URL = "https://backend-api"; // replace with API URL

interface SignUpResponse {
  success: boolean;
  message: string;
}

interface SignInResponse {
    success: boolean;
    message: string;
    token?: string;
}

export const signUp = async (username: string, password: string): Promise<SignUpResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to sign up" };
  }
};

export const signIn = async (username: string, password: string): Promise<SignInResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to sign in");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return { success: false, message: "Failed to sign in" };
    }
  };