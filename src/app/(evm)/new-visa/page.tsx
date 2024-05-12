import VisaColumnsLayout from "@/components/custom/VisaColumnsLayout";
import axios from "@/config";
import API from "@/services/api";
import { IPData } from "@/types";

// Define types and interfaces
interface Country {
  name: string;
  cioc: string;
  callingCodes: string;
  flag: string;
  synonyms: string[];
}

interface NationalityResponse {
  data: string; // This should be a string indicating status, not the response data
  dataobj:
    | {
        data: Country[]; // Update to allow empty array value for dataobj.data
      }
    | any;
}

// Define a type for the props
type Props = {};

// Function to fetch IP data
const getData = async (): Promise<IPData | null> => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// Function to get nationalities
const getNationalities = async (): Promise<Country[] | []> => {
  try {
    const response = await axios.get<NationalityResponse>(
      API.getNationalities,
      {
        params: {
          domain_host: "cp-vi-stage.visaero.com",
        },
      }
    );

    const { data: status, dataobj: countries } = response.data;

    if (status === "success" && countries?.data && countries.data.length > 0) {
      return countries.data ?? [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching nationality data:", error);
    return [];
  }
};

// Page component
const Page = async (props: Props) => {
  // Fetch data
  const ipData = await getData();
  const nationalityResp = await getNationalities();

  // Render page content
  return (
    <div className="h-full">
      {/* Pass props to VisaColumnsLayout */}
      <VisaColumnsLayout nationalities={nationalityResp} ipData={ipData} />
    </div>
  );
};

export default Page;
