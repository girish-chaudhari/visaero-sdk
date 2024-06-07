"use client";

import { getTravellingTo, getVisaOffers } from "@/actions/new-visa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyProps, IPData } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { type Option } from "../ui/autocomplete";
import AutoSelect from "../ui/autoselect";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import VisaCardComponent from "./VisaCardComponent";
import { Separator } from "../ui/separator";

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
  const getTravellingToData = useMutation({
    mutationKey: ["getVisaOffers"],
    mutationFn: () =>
      getVisaOffers({
        currency: "USD",
        managed_by: "master",
        nationality: nationality.value as string,
        travelling_to: travellingTo!.value,
        travelling_to_identity: travellingTo!.identity,
        type: "qr-visa",
      }),
  });
  // const ref = useRef<HTMLFormElement | null>(null);
  const path = usePathname();
  const { nationalities, ipData, supportedCurrencies: currencies } = props;
  let opt = nationalities.find((x) => x?.cioc === ipData?.country_code_iso3);
  const [colLayout, setColLayout] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [isCorEnabled, setIsCorEnabled] = useState<boolean>(false);
  const [nationality, setNationality] = useState<Option>({
    label: opt?.name ?? "",
    value: opt?.name ?? "",
    icon: opt?.flag ?? "",
    ...(opt ?? {}),
  });
  const [travellingTo, setTravellingTo] = useState<Option | undefined>();
  const [cor, setCor] = useState<Option>({
    label: opt?.name ?? "",
    value: opt?.name ?? "",
    icon: opt?.flag ?? "",
    ...(opt ?? {}),
  });

  // const travellingToData: Option[] = [];

  const { data: travellingToData, isLoading } = useQuery({
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

  console.log("travellingToData", travellingToData);

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
    setTravellingTo({} as any);
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
    getTravellingToData.mutate();
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
            getTravellingToData.mutate();
          }}
          value={cor}
        />
      </div>
    </>
  );

  return (
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
            {getTravellingToData.isPending ? (
              <>
                <Skeleton className=" w-[150px] mt-3 ml-auto h-8 rounded-md" />
                <LoadingVisaCards />
              </>
            ) : (
              <>
                {!!currencies?.length ? (
                  <>
                    <div className="my-3 px-3 border-b py-2 max-w-md mx-auto sticky top-0 bg-white">
                      <Select
                        value={selectedCurrency}
                        onValueChange={setSelectedCurrency}
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
                    <div className="space-y-5 pb-5 px-3 max-w-md mx-auto ">
                      {new Array(3).fill("").map((x: any, i: number) => (
                        <Card className="overflow-hidden rounded-sm">
                          <CardHeader className="bg-primary/30 p-2">
                            <CardTitle className="text-md ">
                              30 Days e-Visa
                            </CardTitle>
                            <div className="h-6 relative">
                              <span className="bg-primary text-white pl-3 pr-10 py-1.5 text-xs/3  absolute -left-3 ribin_cut">
                                + Basic Insurance
                              </span>
                            </div>
                            {/* <CardDescription className="text-sm ">
                              Card Description
                            </CardDescription> */}
                          </CardHeader>
                          <CardContent>
                            <div>
                              Tourist | Standard | Single Entry | 30 Days
                            </div>
                            <p>Visa Validity: 58 Days from date of issue</p>
                            <p>Visa Validity: 58 Days from date of issue</p>
                            <p>Visa Validity: 58 Days from date of issue</p>
                            <p>Visa Validity: 58 Days from date of issue</p>
                          </CardContent>
                          <CardFooter className="bg-primary pb-3 text-white">
                            <div className="mt-3 underline ">More Details</div>
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
