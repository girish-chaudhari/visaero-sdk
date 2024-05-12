"use client";

import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import InputMask from "react-input-mask";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { JSX, RefAttributes } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import React from "react";

interface Props {
  formData: any;
  dataDictionary: any;
}

interface Validations {
  mandatory?: boolean;
  min_length?: number;
  special_char?: boolean;
  read_only?: boolean;
  isDigit?: boolean;
  display?: boolean;
}

interface Field {
  name: string;
  label: string;
  type: string;
  validations: Validations;
  value: string;
  group_elements?: Field[];
  options?: string[];
}

export function VisaForm(props: Props) {
  const { formData } = props;
  const form = useFormContext(); // retrieve all hook methods

  const renderForm = (field: Field, ind: number) => {
    const { type, validations } = field;

    switch (type) {
      case "sub_group":
        return <SubGroup field={field} key={ind} />;
      case "textField":
        return <InputField field={field} key={ind} />;
      case "dropdown":
        return <DropDownField field={field} key={ind} />;
      case "dateControl":
        return <DatePickerField field={field} key={ind} />;
      default:
        return <InputField field={field} key={ind} />;
    }
  };

  return (
    <>
      <Card className="overflow-hidden h-full">
        <CardHeader className="bg-gray-100">
          <CardTitle>
            <div className="flex gap-3 items-center">
              <div className="text-xl">Visa Form</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* <ScrollArea >
            {formData?.map((x: Field, i: number) => {
              return (
                <React.Fragment key={i}>
                  <div className="p-4 ">
                    <div className="text-xl mb-2 text-black font-bold">
                      {x?.label}
                    </div>
                    <div className="text-[0.8rem] mb-2 text-slate-400">
                      Key personal details required for identification purposes
                      in the visa application.
                    </div>
                    <hr className="w-1/2" />
                    <div className="grid grid-cols-3 gap-4 p-2">
                      {x?.group_elements?.map(renderForm)}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </ScrollArea> */}
        </CardContent>
      </Card>
    </>
  );
}

interface SubGroupProps {
  field: Field;
  children?: React.ReactNode;
}
interface FieldRenderProps {
  field: Field;
}

const SubGroup: React.FC<SubGroupProps> = ({ field, children }) => {
  const { name, label, type, validations, value } = field;
  return (
    <Card className={`overflow-hidden`}>
      <CardContent className="p-4">
        <div className="text-md">{label}</div>
        {children && <div>{children}</div>}
      </CardContent>
    </Card>
  );
};

const InputField: React.FC<FieldRenderProps> = ({ field }) => {
  const form = useFormContext(); // retrieve all hook methods
  const { name, label, type, validations, value } = field;

  // const fieldState = form.getFieldState("test", form.formState);

  // console.log(name + "error >", fieldState);

  return (
    <FormField
      disabled={validations?.read_only}
      rules={{
        required: !!validations?.mandatory,
        minLength: validations.min_length,
      }}
      control={form.control}
      name={name}
      defaultValue={value ?? ""}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={label} {...field} />
          </FormControl>
          {/* <FormDescription>This is your public display name.</FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
const DropDownField: React.FC<FieldRenderProps> = ({ field }) => {
  const form = useFormContext(); // retrieve all hook methods
  const { name, label, type, validations, value, options } = field;

  return (
    <FormField
      disabled={validations?.read_only}
      rules={{
        required: !!validations?.mandatory && label + " is required",
        minLength: validations.min_length,
      }}
      control={form.control}
      name={name}
      defaultValue={value ?? ""}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {/* <Input {...field} /> */}
            <Select {...field}>
              <SelectTrigger>
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                {!!options?.length ? (
                  <>
                    <SelectItem value="d">Please select a value</SelectItem>
                    {options?.map((v: string) => (
                      <SelectItem value={v}>{v}</SelectItem>
                    ))}
                  </>
                ) : (
                  <>
                    <SelectItem value="d">Options are not available</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          {/* <FormDescription>This is your public display name.</FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
const DatePickerField: React.FC<FieldRenderProps> = ({ field }) => {
  const form = useFormContext(); // retrieve all hook methods
  const { name, label, type, validations, value, options } = field;

  return (
    <FormField
      disabled={validations?.read_only}
      rules={{
        required: !!validations?.mandatory && label + " is required",
        minLength: validations.min_length,
      }}
      control={form.control}
      name={name}
      defaultValue={value ?? ""}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {/* <Input {...field} /> */}
            <>
              <InputMask mask="99-99-9999" {...field} className="relative">
                {
                  // @ts-expect-error
                  (inputProps: HTMLInputElement) => (
                    <div className="relative">
                      {/*  @ts-expect-error */}
                      <Input {...inputProps} placeholder={label} />
                      <CalendarIcon className="absolute right-3 z-10 cursor-pointer translate-y-[-50%] top-[50%] h-4 w-4 opacity-50" />
                    </div>
                  )
                }
              </InputMask>
            </>
            {/* <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                field?.value
              ) : (
                // format(field?.value, "PPP")
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button> */}
          </FormControl>
          {/* <FormDescription>This is your public display name.</FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
