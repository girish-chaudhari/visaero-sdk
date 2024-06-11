"use client";

import {
  getTravellingTo,
  getVisaOffers,
  uploadAndExtractDocumentsAction,
} from "@/actions/new-visa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import API from "@/services/api";
import { CurrencyProps, IPData, UploadedFile, VisaOfferProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosProgressEvent, CancelToken, CancelTokenSource } from "axios";
import clsx from "clsx";
import { CircleChevronRight, LoaderCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { DatePickerWithRange } from "./DateRangeModal";
import VisaCardComponent from "./VisaCardComponent";
// import axios from "@/config";
import axios from "axios";
import Image from "next/image";
import Dragger from "../Dragger";
import { toast } from "../ui/use-toast";

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

  const path = usePathname();
  // console.log(ipData);
  let opt = nationalities.find((x) => x?.cioc === ipData?.country_code_iso3);
  const [colLayout, setColLayout] = useState(1);
  const [selectedCurrency, setSelectedCurrency] =
    useState<string>(defaultCurrency);
  const [isCorEnabled, setIsCorEnabled] = useState<boolean>(false);
  const [modalData, setModalData] = useState<VisaOfferProps | undefined>();
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
  const [visaObj, setVisaObj] = useState<VisaOfferProps | undefined>(undefined);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedVisa, setSelectedVisa] = useState<number | undefined>(
    undefined
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const getVisaOffersData = useMutation({
    mutationKey: ["getVisaOffers"],
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
  const uploadAndExtractDocuments = useMutation({
    mutationKey: ["uploadAndExtractDocuments"],
    mutationFn: (formData: FormData) => {
      console.log(formData);
      return uploadAndExtractDocumentsAction(formData);
    },
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

  useMemo(() => {
    typeof selectedVisa === "number" &&
      !isNaN(selectedVisa) &&
      setVisaObj(visaOffersData?.[selectedVisa]);
  }, [getVisaOffersData.data]);

  // function for handleVisaClicked
  const handleVisaClicked = (obj: VisaOfferProps, ind: number) => {
    setVisaObj(obj);
    setColLayout(3);
    setSelectedVisa(ind);
  };

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
    typeof selectedVisa === "number" &&
      !isNaN(selectedVisa) &&
      setSelectedVisa(undefined);
    // getVisaOffersData.mutateAsync()
    getVisaOffersData.mutate();
  };

  // country of residence change
  const handleCorChange = (opt: unknown) => {
    setCor(opt as Option);
    getVisaOffersData.mutate();
    typeof selectedVisa === "number" &&
      !isNaN(selectedVisa) &&
      setSelectedVisa(undefined);
  };

  const handleUploadDoc = async (
    formData: FormData,
    options: {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
      cancelToken: CancelToken;
    }
  ) => {
    return axios.post(API.uploadAndExtractDocuments, formData, {
      onUploadProgress: options.onUploadProgress,
      cancelToken: options.cancelToken,
    });
  };

  // feel free to mode all these functions to separate utils
  // here is just for simplicity
  const onUploadProgress = (
    progressEvent: AxiosProgressEvent,
    file: File,
    cancelSource: CancelTokenSource
  ) => {
    const progress = Math.round(
      (progressEvent.loaded / (progressEvent.total ?? 0)) * 100
    );

    if (progress === 100) {
      // setUploadedFiles((prevUploadedFiles) => {
      //   return [...prevUploadedFiles, file];
      // });

      // setFilesToUpload((prevUploadProgress) => {
      //   return prevUploadProgress.filter((item) => item.File !== file);
      // });

      return;
    }
  };

  const handleUploadFile = useCallback(async (acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    const fileUploadBatch = acceptedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("host", "visaero");
      const cancelSource = axios.CancelToken.source();
      let data = await uploadAndExtractDocuments.mutateAsync(formData, {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error uploading files",
            description: "An error occurred while uploading your files",
          });
        },
      });

      console.log(data);
      return data;
    });

    try {
      let res = await Promise.all(fileUploadBatch).then((res: any) => {
        console.log(res);
        res.map(
          (resp: { data: "success" | "error"; dataobj: UploadedFile[] }) => {
            if (resp.data === "success") {
              setUploadedFiles((prevUploadedFiles: UploadedFile[]) => {
                const newUploadedFiles = [
                  ...prevUploadedFiles,
                  ...resp?.dataobj,
                ];
                return newUploadedFiles;
              });
            }
          }
        );
      });
      console.log(res);
      toast({
        variant: "default",
        title: "Files uploaded successfully!",
        description: "Your files have been uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading files: ", error);
      toast({
        variant: "destructive",
        title: "Error uploading files",
        description: "An error occurred while uploading your files",
      });
    }
  }, []);

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
          onChange={handleCorChange}
          value={cor}
        />
      </div>
      <div className={`my-2`}>
        <DatePickerWithRange />
      </div>
    </>
  );

  return (
    <>
      <Dialog open={isOpenModal} modal onOpenChange={setIsOpenModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[calc(100vh-5rem)] overflow">
          <DialogHeader>
            <DialogTitle className="text-primary text-xl">
              {modalData?.visa_details.duration_display}{" "}
              {modalData?.visa_type === "evisa"
                ? `e-Visa`
                : modalData?.visa_type}{" "}
              {modalData?.is_visaero_insurance_bundled ? " + Insurance" : ""}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(100vh-20rem)] -mx-6 px-6">
            <h3 className="text-lg font-bold mb-2">Fee Breakup</h3>
            <div className="bg-slate-100 rounded-xl border border-slate-300 shadow-sm px-3 py-4 space-y-3 mb-2 text-sm font-semibold">
              <div className="flex justify-between ">
                <div>
                  Visa{" "}
                  {modalData?.is_visaero_insurance_bundled
                    ? " + Insurance Fee"
                    : ""}
                </div>
                <div>
                  {modalData?.visa_details.fees.currency}{" "}
                  {modalData?.visa_details.fees.adult_govt_fee}
                </div>
              </div>
              <div className="flex justify-between">
                <div>Service Fee & Taxes</div>
                <div>
                  {modalData?.visa_details.fees.currency}{" "}
                  {modalData?.visa_details.fees.adult_service_fee}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-primary">Total</div>
                <div>
                  {modalData?.visa_details.fees.currency}{" "}
                  {modalData?.visa_details.fees.total_cost}
                </div>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="bg-slate-100 border-slate-300 shadow-sm border rounded font-semibold p-3">
              {modalData?.visa_type === "evisa"
                ? `e-Visa`
                : modalData?.visa_type}
            </div>
            <div className="flex h-5 items-center space-x-4 text-sm my-3 w-full font-bold text-gray-800 capitalize">
              <div className="flex-1">{modalData?.visa_category}</div>
              <Separator orientation="vertical" />
              <div className="flex-1 text-center">
                {modalData?.processing_type}
              </div>
              <Separator orientation="vertical" />
              <div className="flex-1 text-end">
                {modalData?.entry_type} Entry
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <b>Visa Validity: &nbsp;</b>
                <div>{modalData?.visa_details.visa_validity}</div>
              </div>
              <div className="flex">
                <b>Stay Validity: &nbsp;</b>
                <div>{modalData?.visa_details.stay_validity}</div>
              </div>
              <div className="flex">
                <b>Processing Time: &nbsp;</b>
                <div>{modalData?.visa_details.processing_time}</div>
              </div>
            </div>
            {modalData?.visa_details.description && (
              <p className="text-[0.8rem] text-slate-400 my-2">
                {modalData?.visa_details.description}
              </p>
            )}
            {modalData?.is_visaero_insurance_bundled && (
              <>
                <Separator className="my-3" />
                <div className="bg-slate-100 border-slate-300 shadow-sm border rounded font-semibold p-3">
                  Travel Insurance
                </div>
                <table className="text-sm my-2">
                  {modalData?.insurance_details?.insurance_desc?.map(
                    (a, i: number) => (
                      <tr key={i} className="text-sm">
                        <td className="w-[50%] font-semibold">{a.name}:</td>
                        <td className="w-[50%]">{a.value}</td>
                      </tr>
                    )
                  )}
                </table>
              </>
            )}
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
                <div className="px-3 max-w-md mx-auto">
                  <Skeleton className=" w-[150px] mt-3 ml-auto h-8 rounded-md" />
                  <LoadingVisaCards />
                </div>
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
                          <Card
                            key={i}
                            className={clsx("overflow-hidden rounded-sm", {
                              "border-primary shadow-sm shadow-primary border-2":
                                i === selectedVisa,
                            })}
                            onClick={() => handleVisaClicked(x, i)}
                          >
                            <CardHeader className="bg-primary/30 px-2 py-3">
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
                            <CardContent className="text-sm text-slate-500 space-y-1 min-h-32">
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
                                  onClick={(e) => {
                                    setIsOpenModal(true);
                                    setModalData(x);
                                    // stop propogation
                                    e.stopPropagation();
                                  }}
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
            <div className="my-2">
              <Dragger
                uploadOptions={{
                  accept: {
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                    "image/heic": [".heic"],
                    "application/pdf": [".pdf"],
                  },
                  multiple: true,
                  onError: (error) => console.log("error", error),
                  maxSize: 10 * 1024 * 1024, // 10 MB
                  onDrop: handleUploadFile,
                }}
              />
              {uploadAndExtractDocuments.isPending && (
                <div className="my-2 flex gap-2 text-slate-500 text-xs items-center">
                  Documents are being uploaded{" "}
                  <LoaderCircle className="animate-spin text-primary h-5 w-5" />
                </div>
              )}
              {!!uploadedFiles?.length && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full border-primary bg-primary/10 hover:bg-primary/20 my-3 text-primary hover:text-primary"
                    >
                      View Uploaded Documents &nbsp;
                      <span className="rounded-full border min-w-6 min-h-6 flex items-center justify-center border-primary px-2 py-0.5">
                        {uploadedFiles?.length}
                      </span>
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[600px] min-w-[60vw] h-[75vh]">
                    <DialogHeader>
                      <DialogTitle>Uploaded Documents</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh]">
                      <div className="grid lg:grid-cols-4 sm:grid-cols-3 gap-4">
                        {uploadedFiles.map((x: UploadedFile, i: number) => (
                          <div
                            key={i}
                            className="bg-gray-300 p-3 rounded-lg max-h-72"
                          >
                            <div className="flex justify-center items-center gap-4 my-2">
                              {" "}
                              <span className="text-ellipsis overflow-hidden">
                                {x.file_name}
                              </span>{" "}
                              <Trash2 className="h-[24px] w-[24px] cursor-pointer" />
                            </div>
                            <div className="h-32 flex align-bottom justify-center relative">
                              <Image
                                src={x?.file}
                                // height={275}
                                // width={225}
                                alt={x.file_name}
                                // objectFit="fill"
                                fill
                                // objectFit="contain"
                                className="rounded max-h-36 max-w-52 w-full object-contain "
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    {/* <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter> */}
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </VisaCardComponent>
        </div>
        <Card className="w-full flex items-center justify-end p-3 rounded-b-none ">
          <Link href={path + "/review"}>
            <Button variant={"destructive"}>Proceed </Button>
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
