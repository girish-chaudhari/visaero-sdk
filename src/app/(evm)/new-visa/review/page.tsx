import VisaReviewLayout from "@/components/custom/VisaReviewLayout";
import axios from "@/config";
import React from "react";

type Props = {};

interface VisaFormResponse {
  // Define the structure of the response if necessary
  // Adjust this according to the actual response structure
  data: any; // Change 'any' to the actual type of the response data
  dataobj: any;
}

const getReviewVisaForm = async (): Promise<any | null> => {
  try {
    const response = await axios.post<VisaFormResponse>(
      "https://master-uat-server.visaero.com/visa/getReviewFormForApplicant",
      {
        applicant_id: "664e228b534bc710ee7c2081",
        name: "visa_form_template",
        travelling_to_identity: "IND_IND_KEN",
        structure: "new",
      },
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2FkbWluX2lkIjoiNjY0ZTIyNDM1MzRiYzcxMGVlN2MyMDdlIiwiaG9zdCI6InZpc2Flcm8iLCJzZXNzaW9uX2lkIjoiYzQyM2E1ZTk5MTYyNGJlNGQxZjM4NWQ2NDcxYWQ5MzgzYmEwYTRmODcxMGYzYTNiY2Q3NjU1MjBmZDcxNDY0NCIsInRva2VuX3R5cGUiOiJiMmNfdXNlciIsImlhdCI6MTcxNjM5NjYxMSwiZXhwIjoxNzI0MTcyNjExfQ.va-f7GR4V2WphZ3Z1h796Ij-8loeNg2R5Iqr0f8MQkc",
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
    return {};
    // You can handle errors here or rethrow them if necessary
    throw error;
  }
};

const page = async (props: Props) => {
  const { visa_form, data_dictionary } = await getReviewVisaForm();
  console.log(visa_form, "data_dictionary", data_dictionary);

  return (
    <VisaReviewLayout
      formData={visa_form ?? []}
      dataDictionary={data_dictionary}
    />
  );
};

export default page;
