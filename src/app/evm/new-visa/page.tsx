import {
  getIpData,
  getNationalities,
  getServerSessionForAnonymousUser,
  getSupportedCurrencies,
} from "@/actions/new-visa";
import VisaColumnsLayout from "@/components/custom/VisaColumnsLayout";
import { AnonymousUserProps, CurrencyProps } from "@/types";
import { signIn } from "next-auth/react";

// Define a type for the props
type Props = {};

// Page component
const Page = async (props: Props) => {
  const data = await getServerSessionForAnonymousUser();
  const dataObj: AnonymousUserProps = data.dataobj;
  console.log("data >>", dataObj)
  const credentials = {
    user_id: dataObj?._id,
    host: dataObj?.host,
    user_type: dataObj?.user_type,
    session_id: dataObj?.session_id,
    role_name: dataObj?.role,
    access_token: dataObj?.accessToken,
    refresh_token: dataObj?.refreshToken,
  };

  // await signIn("credentials", {
  //   redirect: false,
  //   ...credentials,
  // });
  // Fetch data
  const ipData = await getIpData();
  const nationalityResp = await getNationalities();
  const supportedCurrencies = await getSupportedCurrencies();
  // Render page content

  console.log(supportedCurrencies);
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
        // userSession={data?.dataobj ?? {}} // Pass user session data
      />
    </div>
  );
};

export default Page;
