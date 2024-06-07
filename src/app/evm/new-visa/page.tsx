import {
  getIpData,
  getNationalities,
  getSupportedCurrencies,
} from "@/actions/new-visa";
import VisaColumnsLayout from "@/components/custom/VisaColumnsLayout";
import { CurrencyProps } from "@/types";

// Define a type for the props
type Props = {};

// Page component
const Page = async (props: Props) => {
  // Fetch data
  const ipData = await getIpData();
  const nationalityResp = await getNationalities();
  const supportedCurrencies = await getSupportedCurrencies();
  // Render page content

  console.log(supportedCurrencies)
  let currencyArr: CurrencyProps[] =
    supportedCurrencies?.data === "success"
      ? supportedCurrencies?.dataobj?.currencies ?? []
      : [];


  return (
    <div className="h-full">
      {/* Pass props to VisaColumnsLayout */}
      <VisaColumnsLayout
        nationalities={nationalityResp}
        ipData={ipData}
        supportedCurrencies={currencyArr}
      />
    </div>
  );
};

export default Page;
