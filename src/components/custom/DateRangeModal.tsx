"use client";

import { addDays, addYears, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export interface SelectedDates {
  from: Date;
  to: Date;
}
interface Props {
  className?: string;
  selectedDates?: SelectedDates;
  onSelect?: (dates: SelectedDates) => void;
}

export const DatePickerWithRange = React.memo(
  ({ className, selectedDates, onSelect }: Props) => {
    const fromDate = addDays(new Date(), 1);
    const toDate = addYears(fromDate, 25);
    const [date, setDate] = React.useState<DateRange | undefined>(
      selectedDates || {
        from: fromDate,
        to: addDays(fromDate, 6),
      }
    );

    const handleSelect = (date: any) => {
      setDate(date as DateRange);
      // check if date.from and date.to is valid and not equal
      if (date.from && date.to && date.from.getTime() !== date.to.getTime()) {
        onSelect?.(date as SelectedDates);
      }
    };

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
                onSelect={handleSelect}
                numberOfMonths={2}
              />
            </div>
            <DialogFooter className="p-3">
              <Button variant={"secondary"} onClick={() => setDate(undefined)}>
                Clear
              </Button>
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
