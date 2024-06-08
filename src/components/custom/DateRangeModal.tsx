"use client";

import * as React from "react";
import { addDays, addMonths, addYears, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const DatePickerWithRange = React.memo(
  ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
    const fromDate = addDays(new Date(), 1);
    const toDate = addYears(fromDate, 25);
    const [date, setDate] = React.useState<DateRange | undefined>({
      from: fromDate,
      to: addDays(fromDate, 6),
    });

    // console.log(date)

    return (
      <div className={cn("grid gap-2", className)}>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[575px] p-0">
            <DialogHeader className="p-3">
              <DialogTitle>Select Travel Dates</DialogTitle>
            </DialogHeader>
            <div className="m-auto">
              <Calendar
                fromDate={fromDate}
                toDate={toDate}
                captionLayout="dropdown"
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </div>
            <DialogFooter className="p-3">
              <Button variant={'secondary'} onClick={() => setDate(undefined)}>Clear</Button>
              <DialogTrigger asChild>
                <Button variant={"destructive"}>Save</Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);
