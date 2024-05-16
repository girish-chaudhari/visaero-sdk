"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
      <CardContent className="h-full px-0 ps-2 pb-24">
          <ScrollArea className="h-full">
          <div className="p-4 pb-0 space-y-4">
            {Array.from({length: 5}).fill("").map((_, i) => (
              <div
                key={i}
                className="bg-muted flex items-center justify-center rounded-lg h-32"
              >
                <p>Image {i}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DocumentsCard;
