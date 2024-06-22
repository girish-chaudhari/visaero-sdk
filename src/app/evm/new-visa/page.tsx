import {
  getIpData,
  getNationalities,
  getServerSessionForAnonymousUser,
  getSupportedCurrencies,
} from "@/actions/new-visa";
import VisaColumnsLayout from "@/components/custom/VisaColumnsLayout";
import { axiosInstance } from "@/config";
import { AnonymousUserProps, CurrencyProps } from "@/types";

// Define a type for the props
type Props = {};

// Page component
const Page = async (props: Props) => {
  const data = await getServerSessionForAnonymousUser();
  const dataObj: AnonymousUserProps = data.dataobj;
  console.log("data >>", dataObj);
  axiosInstance.interceptors.request.use(
    async (config) => {
      console.log('works interceptor', dataObj)
      if (dataObj?.accessToken) {
        config.headers.Authorization = dataObj.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

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
        // credentials={credentials}
        credentials={dataObj}
        supportedCurrencies={currencyArr}
      />
    </div>
  );
};

export default Page;
