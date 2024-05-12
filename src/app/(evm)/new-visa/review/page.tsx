import VisaReviewLayout from "@/components/custom/VisaReviewLayout";
import axios from "@/config";
import React from "react";

type Props = {};

interface VisaFormResponse {
  // Define the structure of the response if necessary
  // Adjust this according to the actual response structure
  data: any; // Change 'any' to the actual type of the response data
  dataobj: any
}

const getReviewVisaForm = async (): Promise<any | null> => {
  try {
    const response = await axios.post<VisaFormResponse>(
      "https://master-uat-server.visaero.com/visa/getReviewFormForApplicant",
      {
        applicant_id: "663ee3b4d997c37798e52f23",
        name: "visa_form_template",
        travelling_to_identity: "IND_IND_ARE",
        structure: "new",
      },
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2FkbWluX2lkIjoiNjYzZWUzOGM1ZjUzZmYzNjlhNzY4MTU0IiwiaG9zdCI6InZpc2Flcm8iLCJzZXNzaW9uX2lkIjoiYWYwOWNmMzVjMWRjM2M1Y2RiMWExYWI1NmI5MWIxNjZiN2ExOTM0YzBjNzgyMzgzNzZlOWUwNzkxNWRjODk1MiIsInRva2VuX3R5cGUiOiJiMmNfdXNlciIsImlhdCI6MTcxNTM5NzUxNiwiZXhwIjoxNzIzMTczNTE2fQ.tRJckcjnwhmOK5h-qImjfTDxPT-HzvGXGOBVW-AqHIg",
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
    return {}
    // You can handle errors here or rethrow them if necessary
    throw error;
  }
};

const page = async (props: Props) => {
  const {visa_form, data_dictionary} = await getReviewVisaForm();
  console.log(visa_form, "data_dictionary", data_dictionary);

  return <VisaReviewLayout formData={visa_form ?? []} dataDictionary={data_dictionary} />;
};

export default page;
