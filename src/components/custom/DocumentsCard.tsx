import { ScrollArea } from "@radix-ui/react-scroll-area";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

type Props = {};

const DocumentsCard = (props: Props) => {
  return (
    <Card className={`overflow-hidden h-full`}>
      <CardHeader className="bg-gray-100">
        <CardTitle>
          <div className="flex gap-3 items-center">
            <div className="text-xl">Uploaded Documents</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-96 overflow-y-auto">
          <div className=" pb-0 space-y-4">
            <div className="bg-muted flex items-center justify-center rounded-lg  h-44">
              <p>Image 1</p>
            </div>
            <div className="bg-muted flex items-center justify-center rounded-lg  h-44">
              <p>Image 2</p>
            </div>
            <div className="bg-muted flex items-center justify-center rounded-lg  h-44">
              <p>Image 2</p>
            </div>
            <div className="bg-muted flex items-center justify-center rounded-lg  h-44">
              <p>Image 2</p>
            </div>
            <div className="bg-muted flex items-center justify-center rounded-lg  h-44">
              <p>Image 2</p>
            </div>
            <div className="bg-muted flex items-center justify-center rounded-lg  h-44">
              <p>Image 2</p>
            </div>
            <div className="bg-muted flex items-center justify-center rounded-lg  h-44">
              <p>Image 2</p>
            </div>
           </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DocumentsCard;
