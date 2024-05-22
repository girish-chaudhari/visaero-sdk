"use client";

import { useFormContext } from "react-hook-form";
import InputMask from "react-input-mask";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isAfter, isBefore, isValid, parse } from "date-fns";

import { CalendarIcon } from "lucide-react";
import React, { memo, useMemo, useState } from "react";
import AutoComplete, { type Option } from "../ui/autocomplete";

import AutoSelect from "../ui/autoselect";
import { Calendar } from "../ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface Props {
  formData: any;
  dataDictionary: any;
}
type WhenType = "before" | "after" | string | undefined;

interface Validations {
  mandatory?: boolean;
  min_length?: number;
  special_char?: boolean;
  read_only?: boolean;
  isDigit?: boolean;
  display?: boolean;
  when?: WhenType;
}

interface Field {
  name: string;
  label: string;
  type: string;
  sub_label: string;
  validations: Validations;
  value: string;
  group_elements?: Field[];
  options?: string[];
}

export function VisaForm(props: Props) {
  const { formData } = props;
  // const form = useFormContext(); // retrieve all hook methods

  const renderForm = (field: Field, ind: number, group_name: string) => {
    const { type } = field;

    switch (type) {
      case "sub_group":
        return <SubGroup field={field} key={ind} parentName={group_name} />;
      case "textField":
        return <InputField field={field} key={ind} parentName={group_name} />;
      case "dropdown":
        return (
          <DropDownField field={field} key={ind} parentName={group_name} />
        );
      case "dateControl":
        return (
          <DatePickerField field={field} key={ind} parentName={group_name} />
        );
      default:
        return <InputField field={field} key={ind} parentName={group_name} />;
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
        <CardContent className="h-full px-0 ps-2 pb-24">
          <ScrollArea className="h-full">
            {formData?.map((x: Field, i: number) => {
              const name: string = x?.name;
              return (
                <div className="p-4 " key={i}>
                  <div className="text-xl mb-2 text-black font-bold">
                    {x?.label}
                  </div>
                  <div className="text-[0.8rem] mb-2 text-slate-400">
                    {x?.sub_label}
                  </div>
                  <hr className="w-1/2" />
                  <div className="grid grid-cols-3 gap-4 p-2">
                    {x?.group_elements?.map(
                      (a: Field, i: number) =>
                        !!a?.validations?.display && (
                          <div key={i}>{renderForm(a, i, name)}</div>
                        )
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}

interface SubGroupProps {
  field: Field;
  children?: React.ReactNode;
  parentName?: string;
}
interface FieldRenderProps {
  field: Field;
  parentName?: string;
}

const SubGroup: React.FC<SubGroupProps> = ({ field, children, parentName }) => {
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

const InputField: React.FC<FieldRenderProps> = ({ field, parentName }) => {
  const form = useFormContext(); // retrieve all hook methods
  const { name, label, type, validations, value } = field;

  // const fieldState = form.getFieldState("test", form.formState);

  // console.log(name + "error >", fieldState);
  const isLoading = form.formState.isLoading;

  return (
    <FormField
      disabled={!!validations?.read_only || isLoading}
      rules={{
        required: !!validations?.mandatory && label + " is required",
        minLength: validations?.min_length,
      }}
      control={form.control}
      name={`${parentName}-${name}`}
      defaultValue={value}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {!!validations?.mandatory && (
              <span className="text-red-500">*</span>
            )}
          </FormLabel>
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
const AutoCompleteField: React.FC<FieldRenderProps> = memo(
  ({ field, parentName }) => {
    const form = useFormContext(); // retrieve all hook methods
    const { name, label, type, validations, value, options } = field;
    const isLoading = form.formState.isLoading;

    const allOptions: Option[] | undefined = useMemo(() => {
      return options?.map((x: string) => ({ label: x, value: x }));
    }, []);

    // console.log("value", value, "options >>", options);

    const fieldName: string = `${parentName}-${name}`;

    // const selectedValue: Option | undefined = allOptions?.find((x) => x === form.formState.va));

    return (
      <FormField
        control={form.control}
        name={fieldName}
        // disabled={!!validations?.mandatory || isLoading }
        rules={{
          required: !!validations?.mandatory && label + " is required",
          minLength: validations?.min_length,
        }}
        defaultValue={value ?? ""}
        render={({ field: { value, onChange, ...rest } }) => (
          <FormItem>
            <FormLabel>
              {label}
              {!!validations?.mandatory && (
                <span className="text-red-500">*</span>
              )}
            </FormLabel>
            {/*  @ts-expect-error */}
            <AutoComplete
              options={allOptions ?? []}
              value={{
                label: value,
                value: value,
              }}
              onValueChange={(e) => form.setValue(fieldName, e.value)}
            />

            <Select onValueChange={onChange} defaultValue={value} {...rest}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  {options?.map((v: string, i: number) => (
                    <SelectItem value={(v ?? "").toUpperCase()} key={i}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

const DropDownField: React.FC<FieldRenderProps> = memo(
  ({ field, parentName }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const form = useFormContext(); // retrieve all hook methods
    const { name, label, type, validations, value, options } = field;
    // const isLoading = form.formState.isLoading;

    const fieldName: string = `${parentName}-${name}`;

    let renderOpt = options?.map((x: string) => ({
      label: x,
      value: x,
    }));
    return (
      <FormField
        control={form.control}
        name={`${parentName}-${name}`}
        // disabled={!!validations?.mandatory || isLoading}
        rules={{
          required: !!validations?.mandatory && label + " is required",
          minLength: validations?.min_length,
        }}
        defaultValue={value ?? ""}
        render={({ field: { value, onChange, onBlur, ...rest } }) => (
          <FormItem>
            <FormLabel>
              {label}
              {!!validations?.mandatory && (
                <span className="text-red-500">*</span>
              )}
            </FormLabel>

            <AutoSelect
              options={renderOpt}
              onBlur={onBlur}
              placeholder="Select an option"
              {...rest}
              value={renderOpt?.find((x) => x?.value === value)}
              onChange={(val: any, e) => {
                onChange(val?.value);
              }}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

// Date picker
const DatePickerField: React.FC<FieldRenderProps> = memo(
  ({ field, parentName }) => {
    const [selectedDate, setSelectedDate] = useState<null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const form = useFormContext(); // retrieve all hook methods
    const { name, label, type, validations, value, options } = field;
    const isLoading = form.formState.isLoading;

    const fieldName = `${parentName}-${name}`;

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   console.log("react-date,",e)
    //   field?.onChange(e)
    // }
    const checkMinMaxDate: WhenType = validations?.when || "before"; // Providing a default value of 'before' if validations?.when is undefined

    // console.log("formstate",form.formState)

    // Define validation function for validDate
    const validDate = (date: string) => {
      const parsedDate = parse(date, "dd-MM-yyyy", new Date());
      return (
        isValid(parsedDate) || "Please enter a valid date in dd-mm-yyyy format"
      );
    };

    // Define validation function for minDate
    const minDate = (date: string) => {
      const today = new Date();
      const selectedParsedDate = parse(date, "dd-MM-yyyy", new Date());
      return (
        isBefore(selectedParsedDate, today) ||
        `Date must be before today's date`
      );
    };

    // Define validation function for maxDate
    const maxDate = (date: string) => {
      const today = new Date();
      const selectedParsedDate = parse(date, "dd-MM-yyyy", new Date());
      return (
        isAfter(selectedParsedDate, today) || `Date must be after today's date`
      );
    };

    return (
      <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <FormField
            disabled={validations?.read_only || isLoading}
            rules={{
              required: !!validations?.mandatory && label + " is required",
              validate: {
                validDate,
                ...(checkMinMaxDate === "before" && { minDate }),
                ...(checkMinMaxDate === "after" && { maxDate }),
              },
            }}
            control={form.control}
            name={fieldName}
            defaultValue={value ?? ""}
            render={({ field: { onChange, value, ref } }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {!!validations?.mandatory && (
                    <span className="text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  {/* <Input {...field} /> */}
                  <>
                    <InputMask
                      mask="99-99-9999"
                      onChange={onChange}
                      value={value}
                      className="relative"
                    >
                      {/*  @ts-expect-error */}
                      {(inputProps: HTMLInputElement) => (
                        <div className="relative">
                          {/*  @ts-expect-error */}
                          <Input
                            {...inputProps}
                            ref={ref}
                            placeholder={label}
                          />
                          {/* <DialogTrigger asChild> */}
                          <CalendarIcon
                            onClick={() => setIsOpen(true)}
                            className="absolute right-3 z-10 cursor-pointer translate-y-[-50%] top-[50%] h-4 w-4 opacity-50"
                          />
                          {/* </DialogTrigger> */}
                        </div>
                      )}
                    </InputMask>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Button variant="outline">Edit Profile</Button> */}

          <DialogContent className="max-w-[300px]">
            <DialogHeader>
              <DialogTitle>
                Select a {label}
                {!!validations?.mandatory && (
                  <span className="text-red-500">*</span>
                )}
              </DialogTitle>
              <DialogDescription>
                Please select a {label} as per your document.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center -mx-6">
              <Calendar
                captionLayout="dropdown-buttons"
                fromYear={2010}
                toYear={2024}
                mode="single"
                // @ts-ignore
                selected={selectedDate}
                onSelect={(date: any) => {
                  console.log("coming date >>", date);
                  if (!date) return;
                  // @ts-ignore
                  let val = format(date, "dd-MM-yyyy");
                  console.log(format(date, "dd-MM-yyyy"));
                  form.setValue(fieldName, val);
                  setSelectedDate(date);
                  setIsOpen(false);
                  console.log("date >>", fieldName, ">>", val);
                }}
                className="rounded-md border"
              />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);
