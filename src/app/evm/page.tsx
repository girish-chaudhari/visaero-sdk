import qrCode from "@/assets/qr_visa_img.0c49a04e.png";
import MobileCarousel from "@/components/custom/MobileCarousel";
import { Separator } from "@/components/ui/separator";
// import Logo from "../assets/logo.svg";
import { getEnterpriseData } from "@/actions/global-actions";
import Logo from "@/components/custom/Logo";

const qrCodeSrc: string = qrCode.src;

export default async function Home() {
  const enterpriseData = await getEnterpriseData();
  const logo: string  = enterpriseData?.brand_logo;

  console.log("enterpriseData", enterpriseData);
//   console.log("logo", logo);
  
  return (
    <div className="flex justify-center items-center h-full w-full relative">
      <div className="absolute top-0 w-full px-3 py-2 bg-slate-50/20">
        {/* <Logo className="h-20 object-contain" /> */}
        <Logo logo={logo ?? ""} />
      </div>
      <div className="flex items-center justify-center space-x-4 h-4/6 mx-48">
        <div className="w-full h-full flex items-center justify-center">
          <MobileCarousel />
        </div>
        <Separator orientation="vertical" />
        <div className="flex justify-center items-center h-full w-full">
          <img
            src={qrCodeSrc}
            className="w-3/5 object-contain rounded-3xl"
            alt=""
          />
        </div>
      </div>
      <div className="absolute bottom-0 text-center text-sm text-white w-full px-3 py-2 bg-slate-50/20">
        Copyright reserved by @Visaero
      </div>
    </div>
  );
}
