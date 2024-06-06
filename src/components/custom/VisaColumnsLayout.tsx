"use client";

import { getTravellingTo } from "@/actions/new-visa";
import { delay } from "@/lib/utils";
import { IPData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import AutoComplete, { type Option } from "../ui/autocomplete";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import VisaCardComponent from "./VisaCardComponent";
import { Skeleton } from "../ui/skeleton";

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
            })
          )
        : [],
    [travellingToData]
  );

  console.log("travellingToOptions", travellingToOptions);

  const handleNationalityChange = (opt: Option) => {
    setNationality(opt);
    setCor(opt);
    setTravellingTo(undefined);
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
  };

  const renderVisaTypeCard = () => (
    <>
      <div className="my-2">
        <AutoComplete
          options={natinoalitiesData}
          emptyMessage="No results"
          label={"Nationality"}
          name="nationality"
          placeholder="Nationality"
          onValueChange={handleNationalityChange}
          leftIcon={
            nationality?.flag && (
              <Image
                src={nationality?.flag}
                alt={nationality?.label}
                height={20}
                width={30}
                className="shadow"
                priority
              />
            )
          }
          renderSelectedItemIcon={(option: any) => (
            <Image
              src={option?.flag}
              alt={option?.label}
              height={20}
              width={30}
              className="shadow"
              priority
            />
          )}
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
          onValueChange={setCor}
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
        className="flex gap-5 mb-3 h-fit flex-1 transition-all ease-out duration-1000"
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
        <VisaCardComponent title="Visa Type" colLayout={colLayout} number={2} >
          <div className="px-3 h-full max-w-md mx-auto overflow-y-auto">
            <LoadingVisaCards />
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
