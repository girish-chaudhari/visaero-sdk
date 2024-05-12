"use client";

import { useEffect, useState } from "react";
import AutoComplete, { type Option } from "../ui/autocomplete";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import VisaCardComponent from "./VisaCardComponent";
import { IPData } from "@/types";
import Link from "next/link";

interface Nationality {
  name: string;
  cioc: string;
  callingCodes: string;
  flag: string;
}

type Props = {
  nationalities: Nationality[],
  ipData: IPData | null
};

const VisaColumnsLayout = (props: Props) => {
  const { nationalities, ipData } = props;
  let opt = nationalities.find(x => x?.cioc === ipData?.country_code_iso3)
  const [colLayout, setColLayout] = useState(1);

  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisbled] = useState(false);
  const [value, setValue] = useState<Option>({
    label: opt?.name ?? "",
    value: opt?.name ?? "",
    ...(opt ?? {})
  });

  const delay = (ms: number = 1500) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    // debugger
    // Using a loop
    for (let i = 1; i <= 3; i++) {
      delay(i * 1000) // Multiply by 1000 to convert seconds to milliseconds
        .then(() => {
          setColLayout(i);
          console.log(`Delayed operation executed after ${i} seconds`);
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  }, []);

  const natinoalitiesData =
    nationalities?.map((x) => ({
      label: x?.name,
      value: x?.name,
      flag: x?.flag,
    })) ?? [];
  console.log(natinoalitiesData);
  const renderVisaTypeCard = () => {
    return (
      <>
        <div className="my-2">
          <AutoComplete
            options={natinoalitiesData}
            emptyMessage="No resulsts."
            label={"Nationality"}
            placeholder="Nationality"
            isLoading={isLoading}
            onValueChange={setValue}
            leftIcon={
              value?.flag && (
                <img
                  src={value?.flag}
                  height={25}
                  width={30}
                  className="shadow"
                />
              )
            }
            renderSelectedItemIcon={(options: any) => (
              <img
                src={options?.flag}
                height={15}
                width={20}
                className="shadow"
              />
            )}
            value={value}
            disabled={isDisabled}
          />
        </div>
        <div className="my-2">
          <AutoComplete
            options={natinoalitiesData}
            emptyMessage="No resulsts."
            label={"Travelling to"}
            placeholder="Travelling to"
            isLoading={isLoading}
            onValueChange={setValue}
            renderSelectedItemIcon={(options: any) => (
              <img
                src={options?.flag}
                height={15}
                width={20}
                className="shadow"
              />
            )}
            value={value}
            disabled={isDisabled}
          />
        </div>
        <div className="my-2">
          <AutoComplete
            options={natinoalitiesData}
            emptyMessage="No resulsts."
            label={"Nationality"}
            placeholder="Nationality"
            isLoading={isLoading}
            onValueChange={setValue}
            renderSelectedItemIcon={(options: any) => (
              <img
                src={options?.flag}
                height={15}
                width={20}
                className="shadow"
              />
            )}
            value={value}
            disabled={isDisabled}
          />
        </div>
      </>
    );
  };

  return (
    <div className="h-full p-3 pb-0 flex flex-col overflow-hidden">
      <div
        className="flex gap-5 mb-3 h-fit flex-1 transition-all ease-out"
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
          {renderVisaTypeCard()}
        </VisaCardComponent>
        <VisaCardComponent title="Visa Type" colLayout={colLayout} number={2}>
          testing
        </VisaCardComponent>
        <VisaCardComponent
          title="Upload Documents"
          colLayout={colLayout}
          number={3}
        >
          testing
        </VisaCardComponent>
      </div>
      <Card className="w-full flex items-center justify-end p-3 rounded-b-none ">
        <Link href='/new-visa/review'>
        <Button variant={"destructive"}>Proceed</Button>
        </Link>
      </Card>
    </div>
  );
};

export default VisaColumnsLayout;
