import axios from "axios";
axios.defaults.withCredentials = true;
// const API_BASE_URL = "http://127.0.0.1:8000"; // replace with API URL
const API_BASE_URL = "http://localhost:8000";


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
  school: string;
  address: string;
  owner: number;
  distance: string;
  price: string;
  type: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  pets: boolean;
  smokes: boolean;
  drinks: boolean;
  longitude: number;
  latitude: number;
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
    // if(response.status === 200){
    //   csrfToken = null;
    // }
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
): Promise<UpdateProfileResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/profiles/`,
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
    };
  } catch (error) {
    return { success: false, message: "Failed to update profile" };
  }
};

// get profile
export const getProfile = async (): Promise<GetProfileResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/profiles/`, {
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
export const getProfilePicture = async (id: number): Promise<GetProfilePictureResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/profiles/picture/`, {
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
// add listing
export const addListing = async (formData: FormData): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/listings/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Csrftoken": csrfToken || "",
      },
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};
// get listings
export const getListings = async (): Promise<Listing[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/listings/`, {
      withCredentials: true,
      headers: {
        "X-Csrftoken": csrfToken || "",
      },
    });
    console.log("Listings data:", response.data);
    return response.data.listings;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch listings");
  }
};

export const getSchoolName = async (schoolId: string): Promise<string> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/schools/${schoolId}/`, {
      headers: {
        "X-Csrftoken": csrfToken || "",
      },
      withCredentials: true,
    });

    return response.data.name;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch school name");
  }
}