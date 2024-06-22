"use server";

import axios from "@/config";
import API from "@/services/api";
import {
  unstable_noStore as noStore,
  unstable_cache as cache,
} from "next/cache";

interface VisaFormResponse {
  // Define the structure of the response if necessary
  // Adjust this according to the actual response structure
  data: any; // Change 'any' to the actual type of the response data
  dataobj: any;
}

export const getReviewVisaForm = cache(
  async ({
    application_id,
    travelling_to_identity,
  }: {
    application_id: string;
    travelling_to_identity: string;
  }): Promise<any | null> => {
    try {
      const response = await axios.post<VisaFormResponse>(
        "/visa/getReviewFormForApplicant",
        {
          applicant_id: application_id,
          name: "visa_form_template",
          travelling_to_identity: travelling_to_identity,
          structure: "new",
        }
      );

      const data = response.data;

      // Use the response data
      console.log("Response data:", data);

      if (data?.data === "success") {
        return data?.dataobj;
      }
      // Return the response for further processing if needed
      return {};
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
);

export const saveVisaForm = async (visaForm: object): Promise<any | null> => {
  try {
    const response = await axios.post<VisaFormResponse>(
      API.saveVisaForm,
      {
        applicant_display_status: "true",
        applicant_id: "665949200f651e0a8bf691c5",
        structure: "new",
        visaForm,
      },
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2FkbWluX2lkIjoiNjY1MzU3NzE5ZGE3YThlODQ4ZmQzNjZkIiwiaG9zdCI6InZpc2Flcm8iLCJzZXNzaW9uX2lkIjoiYzhiMTRhNWJlM2QzNTM1MzdiYzUwYTU0Y2Q3OTc4NDY2OWNjNWRjNDZjYTFjNWY4MzY0NmE4ZTM1NjBhMjUwNyIsInRva2VuX3R5cGUiOiJiMmNfdXNlciIsImlhdCI6MTcxNjczNzkwNSwiZXhwIjoxNzI0NTEzOTA1fQ.Y-F9HRpnA8CRM_05KkLAAwfuCL_VypukkyXnYNufj04",
        },
      }
    );

    const data = response.data;

    // Use the response data
    console.log("Response data:", data);

    if (data?.data === "success") {
      return data?.dataobj;
    }
    // Return the response for further processing if needed
    return {};
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// app/test/action.ts

export type FormData = {
  name: string;
  description: string;
};

export async function submitVisaForm(data: FormData) {
  console.log("server visa form", data);
}
