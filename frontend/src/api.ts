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

interface UpdateProfileResponse {
  success: boolean;
  message: string;
}

interface GetProfileResponse {
  id: number;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  pronouns: string | null;
  school: string | null;
  bio: string;
  smokes: boolean;
  pets: boolean;
  drinks: boolean;
  profile_pic: string;
  created_at: string;
  user: number;
}

interface GetProfilePictureResponse {
  url: string;
}

export interface Listing {
  id: number;
  university: string;
  address: string;
  owner: string;
  distance: string;
  price: string;
  buildingType: string;
  description: string;
}

let csrfToken: string | null = null;

// Fetch CSRF token on app startup
export const fetchCSRFToken = async (): Promise<void> => {
  if (!csrfToken) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getcsrf/`, {
        withCredentials: true,
      });
      csrfToken = response.data.csrfToken;
      console.log("Cookie:", document.cookie);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
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
        withCredentials: true,
      }
    );

    return { success: response.status === 201, message: response.data.message };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to sign up" };
  }
};

// sign in
export const signIn = async (formData: FormData): Promise<SignInResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Csrftoken": csrfToken || "",
      },
      withCredentials: true,
    });

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
      withCredentials: true,
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

// update profile
export const updateProfile = async (
  formData: FormData,
  email: string
): Promise<UpdateProfileResponse> => {
  console.log("Caling update profile with cookie:", document.cookie);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/profiles/${email}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Csrftoken": csrfToken || "",
        },
        withCredentials: true,
      }
    );

    return {
      success: response.status === 200,
      message: response.data.message,
    };
  } catch (error) {
    console.log("Failed to update profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
};

// get profile
export const getProfile = async (
  email: string
): Promise<GetProfileResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/profiles/${email}/`, {
      headers: {
        "X-Csrftoken": csrfToken || "",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch profile");
  }
};

// get profile picture
export const getProfilePicture = async (email: string): Promise<GetProfilePictureResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/profiles/${email}/picture/`, {
      headers: {
        "X-Csrftoken": csrfToken || "",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch profile picture");
  }
};

// get listings
export const getListings = async (): Promise<Listing[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/listings/`, {
      headers: {
        "X-Csrftoken": csrfToken || "",
      },
      withCredentials: true,
    });
    console.log("Listings data:", response.data);
    return response.data.listings; // Access the listings property
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch listings");
  }
};
