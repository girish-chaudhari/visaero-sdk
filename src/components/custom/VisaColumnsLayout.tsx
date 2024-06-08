"use client";

import { getTravellingTo, getVisaOffers } from "@/actions/new-visa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyProps, IPData, VisaOfferProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { type Option } from "../ui/autocomplete";
import AutoSelect from "../ui/autoselect";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import VisaCardComponent from "./VisaCardComponent";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { DatePickerWithRange } from "./DateRangeModal";

interface Nationality {
  name: string;
  cioc: string;
  callingCodes: string;
  flag: string;
}

type Props = {
  nationalities: Nationality[];
  ipData: IPData | null;
  supportedCurrencies: CurrencyProps[] | [];
};

const VisaColumnsLayout = (props: Props) => {
  const { nationalities, ipData, supportedCurrencies: currencies } = props;

  const defaultCurrency = useMemo(() => {
    const availableCurrencies = currencies.map((x) => x.currency);
    return (
      (ipData?.currency &&
        availableCurrencies.includes(ipData.currency) &&
        ipData.currency) ||
      (availableCurrencies.includes("USD") && "USD") ||
      availableCurrencies[0] ||
      "USD"
    );
  }, [currencies]);

  // const ref = useRef<HTMLFormElement | null>(null);
  const path = usePathname();
  // console.log(ipData);
  let opt = nationalities.find((x) => x?.cioc === ipData?.country_code_iso3);
  const [colLayout, setColLayout] = useState(1);
  const [selectedCurrency, setSelectedCurrency] =
    useState<string>(defaultCurrency);
  const [isCorEnabled, setIsCorEnabled] = useState<boolean>(false);
  const [nationality, setNationality] = useState<Option | undefined>(
    opt && {
      label: opt?.name ?? "",
      value: opt?.name ?? "",
      icon: opt?.flag ?? "",
      ...(opt ?? {}),
    }
  );
  const [travellingTo, setTravellingTo] = useState<Option | undefined>();
  const [cor, setCor] = useState<Option | undefined>(
    opt && {
      label: opt?.name ?? "",
      value: opt?.name ?? "",
      icon: opt?.flag ?? "",
      ...(opt ?? {}),
    }
  );
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const getVisaOffersData = useMutation({
    mutationKey: [
      "getVisaOffers",
      // {
      //   currency: defaultCurrency,
      //   managed_by: "master",
      //   nationality: nationality?.value as string,
      //   travelling_to: travellingTo?.value,
      //   travelling_to_identity: travellingTo?.identity,
      //   type: "qr-visa",
      // },
    ],
    mutationFn: () =>
      getVisaOffers({
        currency: selectedCurrency,
        managed_by: "master",
        nationality: nationality?.value as string,
        travelling_to: travellingTo?.value as string,
        travelling_to_identity: travellingTo?.identity as string,
        type: "qr-visa",
      }),
  });

  // const travellingToData: Option[] = [];

  const { data: travellingToData } = useQuery({
    queryKey: [
      "getTravellingTo",
      {
        nationality: nationality?.value as string,
        origin: nationality?.value as string,
      },
    ],
    queryFn: () =>
      getTravellingTo({
        nationality: nationality?.value as string,
        origin: cor?.value as string,
      }),
  });

  console.log("travellingToData", getVisaOffersData);
  const visaOffersData = useMemo(
    () =>
      getVisaOffersData.data?.data === "success"
        ? getVisaOffersData.data?.dataobj
        : [],
    [getVisaOffersData]
  );

  console.log(visaOffersData);

  const natinoalitiesData = useMemo(
    () =>
      nationalities?.map((x) => ({
        label: x?.name,
        value: x?.name,
        flag: x?.flag,
        icon: x?.flag,
      })) ?? [],
    []
  );

  const corData = structuredClone(natinoalitiesData);

  const travellingToOptions = useMemo(
    () =>
      travellingToData?.data == "success"
        ? travellingToData?.dataobj?.data?.map(
            (x: {
              managed_by?: string;
              cor_required?: boolean;
              identity: string;
              flag: string;
              name: string;
              value: string;
              icon: string;
            }) => ({
              label: x?.name,
              value: x?.name,
              flag: x?.flag,
              managed_by: x?.managed_by,
              cor_required: !!x?.cor_required,
              identity: x.identity,
              icon: x?.flag,
            })
          )
        : [],
    [travellingToData]
  );

  // console.log("travellingToOptions", travellingToOptions);
  console.log("currencies", currencies);

  const handleNationalityChange = (opt: unknown | Option) => {
    setNationality(opt as Option);
    setCor(opt as Option);
    setTravellingTo(undefined);
    setColLayout(1);
    setIsCorEnabled(false);
  };

  const handleCurrencyChange = (cur: string) => {
    setSelectedCurrency(cur);
    getVisaOffersData.mutate();
  };

  // useEffect(() => {
  //   // Using a loop
  //   for (let i = 1; i <= 3; i++) {
  //     delay(i * 1000) // Multiply by 1000 to convert seconds to milliseconds
  //       .then(() => {
  //         setColLayout(i);
  //         console.log(`Delayed operation executed after ${i} seconds`);
  //       })
  //       .catch((error) => {
  //         console.error("An error occurred:", error);
  //       });
  //   }
  // }, []);

  const handleTravellingToChange = (
    opt:
      | unknown
      | {
          label: string;
          value: string;
          managed_by?: string;
          cor_required?: boolean;
        }
  ) => {
    setTravellingTo(opt as Option);
    // @ts-ignore
    setIsCorEnabled(!!opt?.cor_required);
    setColLayout(2);
    getVisaOffersData.mutate();
  };

  const renderVisaTypeCard = () => (
    <>
      <div className="mb-5 mt-5">
        <AutoSelect
          options={natinoalitiesData}
          name="nationality"
          placeholder="Nationality"
          onChange={handleNationalityChange}
          value={nationality}
        />
      </div>
      <div className="mb-5">
        <AutoSelect
          options={travellingToOptions}
          placeholder="Travelling to"
          name="travelling_to"
          onChange={handleTravellingToChange}
          value={travellingTo}
        />
      </div>
      <div className={`my-2 ${!!isCorEnabled ? "" : "hidden"}`}>
        <AutoSelect
          options={corData}
          name="origin"
          placeholder="Country of Residence"
          onChange={(opt: unknown) => {
            setCor(opt as Option);
            getVisaOffersData.mutate();
          }}
          value={cor}
        />
      </div>
      <div className={`my-2`}>
        <DatePickerWithRange  /> 
      </div>
    </>
  );

  return (
    <>
      <Dialog open={isOpenModal} modal onOpenChange={setIsOpenModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[calc(100vh-5rem)] overflow">
          <DialogHeader>
            <DialogTitle className="text-primary text-xl">
              30 Days e-Visa + Insurance
            </DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
          </DialogHeader>
          <ScrollArea className="h-[calc(100vh-20rem)] -mx-6 px-6">
            <h3 className="text-lg font-bold mb-2">Fee Breakup</h3>
            <div className="bg-slate-100 rounded-xl border border-slate-300 shadow-sm px-3 py-4 space-y-3 mb-2 text-sm font-semibold">
              <div className="flex justify-between ">
                <div>Visa + Insurance Fee</div>
                <div>USD 84.00</div>
              </div>
              <div className="flex justify-between">
                <div>Service Fee & Taxes</div>
                <div>USD 10.50</div>
              </div>
              <div className="flex justify-between">
                <div className="text-primary">Total</div>
                <div>USD 95</div>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="bg-slate-100 border-slate-300 shadow-sm border rounded font-semibold p-3">
              e-Visa
            </div>
            <div className="flex h-5 items-center space-x-4 text-sm my-3 w-full ">
              <div className="flex-1">Tourist</div>
              <Separator orientation="vertical" />
              <div className="flex-1 text-center">Standard</div>
              <Separator orientation="vertical" />
              <div className="flex-1 text-end">Single Entry</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <b>Visa Validity :</b>
                <div>58 Days from date of issue days</div>
              </div>
              <div className="flex">
                <b>Stay Validity :</b>
                <div>30 Days from date of entry</div>
              </div>
              <div className="flex">
                <b>Processing Time :</b>
                <div>3-4 Working Days</div>
              </div>
            </div>
            <p className="text-[0.8rem] text-slate-400 my-2">
              Visa valid for all UAE Emirates
            </p>
            <div className="bg-slate-100 border-slate-300 shadow-sm border rounded font-semibold p-3">
              Travel Insurance
            </div>
            <table className="text-sm my-2">
              <tr>
                <td className="w-[50%] font-semibold">Type of Insurance:</td>
                <td className="w-[50%]">Basic Insurance</td>
              </tr>
              <tr>
                <td className="w-[50%] font-semibold">Provider:</td>
                <td className="w-[50%]">ISA Insurance</td>
              </tr>
              <tr>
                <td className="w-[50%] font-semibold">
                  Medical expenses incurred during hospitalization:
                </td>
                <td className="w-[50%]">$10,000</td>
              </tr>
              <tr>
                <td className="w-[50%] font-semibold">
                  Medical expenses incurred during hospitalization due to
                  Covid-19:
                </td>
                <td className="w-[50%]">Included</td>
              </tr>
              <tr>
                <td className="w-[50%] font-semibold">
                  Emergency medical evacuation:
                </td>
                <td className="w-[50%]">$10,000</td>
              </tr>
              <tr>
                <td className="w-[50%] font-semibold">
                  Emergency medical repatriation:
                </td>
                <td className="w-[50%]">$10,000</td>
              </tr>
            </table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <div className="h-full p-3 pb-0 flex flex-col overflow-hidden">
        <div
          className="flex gap-5 mb-3 flex-1 transition-all h-[calc(100vh-6rem)] ease-out duration-1000 "
          style={{
            width: `calc(${100 * (3 / colLayout) + "%"} + ${
              colLayout === 1 ? 2.3 : colLayout === 2 ? 0.75 : 0
            }rem)`,
          }}
        >
          <VisaCardComponent
            title="Visa Application"
            colLayout={colLayout}
            number={1}
          >
            <div className="max-w-md mx-auto">{renderVisaTypeCard()}</div>
          </VisaCardComponent>
          <VisaCardComponent
            title="Visa Type"
            className="pt-0"
            colLayout={colLayout}
            number={2}
          >
            <div className="">
              {getVisaOffersData.isPending ? (
                <>
                  <Skeleton className=" w-[150px] mt-3 ml-auto h-8 rounded-md" />
                  <LoadingVisaCards />
                </>
              ) : (
                <>
                  {!!visaOffersData?.length ? (
                    <>
                      {!!currencies?.length && (
                        <div className="my-3 px-3 border-b py-2 max-w-md mx-auto sticky z-10 top-0 bg-white">
                          <Select
                            value={selectedCurrency}
                            onValueChange={handleCurrencyChange}
                          >
                            <SelectTrigger className="w-[180px] ml-auto">
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((x, i) => (
                                <SelectItem value={x.currency}>
                                  {x.currency}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="space-y-5 pb-5 px-3 max-w-md mx-auto ">
                        {visaOffersData?.map((x: VisaOfferProps, i: number) => (
                          <Card className="overflow-hidden rounded-sm">
                            <CardHeader className="bg-primary/30 p-2">
                              <CardTitle className="text-md  px-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    {x?.visa_details?.duration_days}{" "}
                                    {x.visa_details.duration_type}{" "}
                                    {x.visa_type === "evisa"
                                      ? "e-Visa"
                                      : x.visa_type}
                                  </div>
                                  {/* <div> 30 Days e-Visa</div> */}
                                  <div>
                                    {x.visa_details.fees.currency}{" "}
                                    {x.visa_details.fees.total_cost}{" "}
                                  </div>
                                </div>
                              </CardTitle>
                              {x.is_visaero_insurance_bundled && (
                                <div className="h-6 relative">
                                  <span className="bg-primary capitalize text-white pl-3 pr-10 py-0.5 text-xs/5 absolute -left-3 ribin_cut">
                                    + {x.insurance_details?.insurance_title}
                                  </span>
                                </div>
                              )}
                              {/* <CardDescription className="text-sm ">
                              Card Description
                            </CardDescription> */}
                            </CardHeader>
                            <CardContent className="text-sm text-slate-500 space-y-1">
                              <div className="pb-1 pt-4 text-sm font-bold text-black capitalize">
                                {x?.visa_category} | {x.processing_type} |{" "}
                                {x.entry_type} Entry |{" "}
                                {x.visa_details.duration_display}
                              </div>

                              <div className="text-xs">
                                Visa Validity: {x.visa_details.visa_validity}
                              </div>
                              <div className="text-xs">
                                Stay Validity: {x.visa_details.stay_validity}
                              </div>
                              <div className="text-xs">
                                Processing Time:{" "}
                                {x.visa_details.processing_time}
                              </div>
                              {x.is_visaero_insurance_bundled &&
                                x.insurance_details?.insurance_coverage?.map(
                                  (ins, i: number) => (
                                    <div className="text-xs" key={i}>
                                      {ins.name}: {ins.value}
                                    </div>
                                  )
                                )}
                            </CardContent>
                            <CardFooter className="bg-primary pb-3 text-white">
                              <div className="mt-3 w-full flex justify-between items-center">
                                <div
                                  className="underline text-sm hover:cursor-pointer font-bold"
                                  onClick={() => setIsOpenModal(true)}
                                >
                                  More Details
                                </div>
                                <CircleChevronRight />
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-500">No data found!</div>
                  )}
                </>
              )}
            </div>
          </VisaCardComponent>
          <VisaCardComponent
            title="Upload Documents"
            colLayout={colLayout}
            number={3}
          >
            test
          </VisaCardComponent>
        </div>
        <Card className="w-full flex items-center justify-end p-3 rounded-b-none ">
          <Link href={path + "/review"}>
            <Button variant={"destructive"}>Proceed</Button>
          </Link>
        </Card>
      </div>
    </>
  );
};

export default VisaColumnsLayout;

const LoadingVisaCards: React.FC = () => {
  let cards = new Array(3).fill("");
  return (
    <>
      {cards.map((_, i) => (
        <div className="flex flex-col my-5 " key={i}>
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </div>
      ))}
    </>
  );
};
