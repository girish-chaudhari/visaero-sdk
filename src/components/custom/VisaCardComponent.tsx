"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import React from "react";

type Props = {
  title: string;
  number: string | number;
  children: React.ReactNode;
  colLayout: number;
};

const VisaCardComponent: React.FC<Props> = ({
  title,
  number,
  children,
  colLayout,
}) => {
  // Use React.FC<Props> for functional components
  return (
    <Card
      className={`overflow-hidden `}
      style={{ width: 100 / colLayout+"%" }}
    >
      <CardHeader className="bg-gray-100">
        <CardTitle>
          <div className="flex gap-3 justify-center items-center">
            <div className="bg-black text-white rounded-full text-sm w-8 h-8 flex justify-center items-center">
              {number}
            </div>
            <div className="text-lg">{title}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="self-start overflow-y-auto w-full mb-6 h-[93%]">{children}</CardContent>
    </Card>
  );
};

export default VisaCardComponent;
