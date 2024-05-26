"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Form } from "../ui/form";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import ApplicationDetails from "./ApplicationDetails";
import DocumentsCard from "./DocumentsCard";
import { VisaForm } from "./VisaForm";

type Props = {
  formData: any;
  dataDictionary: any;
};

const VisaReviewLayout: React.FC<Props> = ({ formData, dataDictionary }) => {
  const methods = useForm();

  const onSubmit = (data: any) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("data >>", data);
        alert(JSON.stringify(data));
        resolve();
      }, 2000);
    });
  };

  // console.log("VisaForm", formData);

  const [activeApplicant, setactiveApplicant] = useState<number | string>("");

  const RenderApplicants = () => {
    return (
      <>
        <Card className={`overflow-hidden w-full`}>
          <CardContent className="p-1">
            <ScrollArea>
              <div className="flex gap-3 m-2">
                {new Array(9).fill("").map((_, i: number) => (
                  <div
                    onClick={() => setactiveApplicant(i)}
                    key={i}
                    className={`flex items-center space-x-4 shadow-lg p-3 rounded-lg cursor-pointer w-[150px]: ${
                      i == activeApplicant
                        ? "border-2 border-primary"
                        : "border-2 border-slate-200"
                    }`}
                  >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[70px]" />
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size={"icon"}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                ))}
                <div
                  className={`flex items-center space-x-4 shadow-lg p-3 rounded-lg border-2 border-slate-200`}
                >
                  <div>
                    <Button variant="outline" size={"icon"}>
                      <Plus />
                    </Button>
                  </div>
                  <div className="space-y-2 w-[150px]">Add Applicant</div>
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="h-screen p-3 pb-0 flex flex-col overflow-hidden">
          {/* Application details */}
          <div className="mb-3">
            <ApplicationDetails />
          </div>
          {/* Applicants Bar */}
          <div className="mb-3">
            <RenderApplicants />
          </div>
          <div className="flex gap-3 h-0 flex-1 mb-3">
            <div className="overflow-hidden w-1/3 h-full">
              <DocumentsCard />
            </div>

            <div className="overflow-hidden w-2/3 h-full">
              <VisaForm formData={formData} dataDictionary={dataDictionary} />
            </div>
          </div>
          <Card className="w-full flex items-center justify-end p-3 rounded-b-none ">
            <Button
              type="submit"
              variant={"destructive"}
              loading={
                methods.formState.isLoading ||
                methods.formState.isSubmitting ||
                methods.formState.isValidating
              }
            >
              Confirm & Proceed
            </Button>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default VisaReviewLayout;
