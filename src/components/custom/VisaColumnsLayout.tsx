"use client";

import { getTravellingTo, getVisaOffers } from "@/actions/new-visa";
import { IPData } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import AutoComplete, { type Option } from "../ui/autocomplete";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import VisaCardComponent from "./VisaCardComponent";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import AutoSelect from "../ui/autoselect";

interface Nationality {
  name: string;
  cioc: string;
  callingCodes: string;
  flag: string;
}

type Props = {
  nationalities: Nationality[];
  ipData: IPData | null;
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
  const { nationalities, ipData } = props;
  let opt = nationalities.find((x) => x?.cioc === ipData?.country_code_iso3);
  const [colLayout, setColLayout] = useState(1);
  const [isCorEnabled, setIsCorEnabled] = useState<boolean>(false);
  const [nationality, setNationality] = useState<Option>({
    label: opt?.name ?? "",
    value: opt?.name ?? "",
    ...(opt ?? {}),
  });
  const [travellingTo, setTravellingTo] = useState<Option | undefined>();
  const [cor, setCor] = useState<Option>({
    label: opt?.name ?? "",
    value: opt?.name ?? "",
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
            }) => ({
              label: x?.name,
              value: x?.name,
              flag: x?.flag,
              managed_by: x?.managed_by,
              cor_required: !!x?.cor_required,
              identity: x.identity,
            })
          )
        : [],
    [travellingToData]
  );

  console.log("travellingToOptions", travellingToOptions);

  const handleNationalityChange = (opt: unknown | Option, ) => {
    setNationality(opt);
    setCor(opt);
    setTravellingTo(undefined);
    setColLayout(1);
    setIsCorEnabled(false);
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

  const handleTravellingToChange = (opt: {
    label: string;
    value: string;
    managed_by?: string;
    cor_required?: boolean;
  }) => {
    console.log(opt);
    setTravellingTo(opt as Option);
    setIsCorEnabled(!!opt?.cor_required);
    setColLayout(2);
    getTravellingToData.mutate();
  };

  const renderVisaTypeCard = () => (
    <>
      <div className="my-2">
        <AutoSelect
          options={natinoalitiesData}
          // emptyMessage="No results"
          // label={"Nationality"}
          name="nationality"
          placeholder="Nationality"
          onChange={handleNationalityChange}
          // leftIcon={
          //   nationality?.flag && (
          //     <Image
          //       src={nationality?.flag}
          //       alt={nationality?.label}
          //       height={20}
          //       width={30}
          //       className="shadow"
          //       priority
          //     />
          //   )
          // }
          // renderSelectedItemIcon={(option: any) => (
          //   <Image
          //     src={option?.flag}
          //     alt={option?.label}
          //     height={20}
          //     width={30}
          //     className="shadow"
          //     priority
          //   />
          // )}
          value={nationality}
        />
      </div>
      <div className="my-2">
        <AutoComplete
          options={travellingToOptions}
          emptyMessage="No results"
          label={"Travelling to"}
          placeholder="Travelling to"
          name="travelling_to"
          onValueChange={handleTravellingToChange}
          isLoading={isLoading}
          leftIcon={
            travellingTo?.flag && (
              <Image
                src={travellingTo?.flag}
                alt={travellingTo?.label}
                height={20}
                width={30}
                className="shadow"
                priority
              />
            )
          }
          renderSelectedItemIcon={(options: any) => (
            <Image
              src={options?.flag}
              alt={options?.label}
              height={20}
              width={30}
              className="shadow"
              priority
            />
          )}
          value={travellingTo}
        />
      </div>
      <div className={`my-2 ${!!isCorEnabled ? "" : "hidden"}`}>
        <AutoComplete
          options={corData}
          name="origin"
          emptyMessage="No results"
          label={"Country of Residence"}
          placeholder="Country of Residence"
          onValueChange={(opt: Option) => {
            setCor(opt);
            getTravellingToData.mutate();
          }}
          leftIcon={
            cor?.flag && (
              <Image
                alt={cor.label}
                src={cor?.flag}
                height={20}
                width={30}
                className="shadow"
                priority
              />
            )
          }
          renderSelectedItemIcon={(options: Option) => (
            <Image
              src={options?.flag}
              alt={options.label}
              height={15}
              width={20}
              className="shadow"
              priority
            />
          )}
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
        <VisaCardComponent title="Visa Type" colLayout={colLayout} number={2}>
          <div className="px-3 max-w-md mx-auto ">
            {getTravellingToData.isPending ? (
              <LoadingVisaCards />
            ) : (
              <>
                <div className="my-3 flex justify-end">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
