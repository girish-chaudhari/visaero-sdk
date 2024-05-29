"use client";

import { Controller, useFormContext } from "react-hook-form";
import InputMask from "react-input-mask";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isAfter, isBefore, isValid, parse } from "date-fns";

import { CalendarIcon } from "lucide-react";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

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
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

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
  dependent_elements: Field[];
  dependent_value: string;
  sub_group_elements: Field[];
}

export const VisaForm = memo((props: Props) => {
  const { formData } = props;

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
                    {x?.group_elements?.map((a: Field, i: number) => (
                      <FormRenderer
                        field={a}
                        ind={i}
                        key={i}
                        parentName={a?.name}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
});

VisaForm.displayName = "VisaForm";

interface FormRendererProps {
  field: Field;
  ind: number;
  parentName: string;
}

const FormRenderer: React.FC<FormRendererProps> = memo(
  ({ field, ind, parentName }) => {
    // const { type } = field;

    field.type = !!!field.validations.display ? "hidden" : field.type;

    const InputView = useMemo(() => {
      switch (field?.type) {
        case "subGroup":
          return <SubGroup field={field} key={ind} parentName={parentName} />;
        case "textField":
          return <InputField field={field} key={ind} parentName={parentName} />;
        case "dropdown":
          return (
            <DropDownField field={field} key={ind} parentName={parentName} />
          );
        case "dateControl":
          return (
            <DatePickerField field={field} key={ind} parentName={parentName} />
          );
        case "hidden":
          return (
            <HiddenField field={field} key={ind} parentName={parentName} />
          );
        default:
          return <InputField field={field} key={ind} parentName={parentName} />;
      }
    }, []);

    return InputView;
  }
);

FormRenderer.displayName = "FormRenderer";

interface SubGroupProps {
  field: Field;
  children?: React.ReactNode;
  parentName?: string;
}
interface FieldRenderProps {
  field: Field;
  parentName?: string;
}

const SubGroup: React.FC<SubGroupProps> = ({ field, parentName }) => {
  const { name, label, sub_group_elements } = field;

  const fieldName: string = `${parentName}-${name}`;

  return (
    <Card className={`overflow-hidden`}>
      <CardHeader className=" py-3 bg-slate-100">
        <CardTitle className="text-sm">{label}</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-3 gap-4 px-3 pt-3">
        {!!sub_group_elements?.length
          ? sub_group_elements.map((x: any) =>
              x?.map((a: Field, i: number) => (
                <FormRenderer field={a} ind={i} parentName={fieldName} />
              ))
            )
          : null}
      </CardContent>
    </Card>
  );
};
SubGroup.displayName = "SubGroup";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const HiddenField: React.FC<FieldRenderProps> = memo(
  ({ field, parentName }) => {
    const form = useFormContext(); // retrieve all hook methods
    const { name, label, validations, value } = field;

    const fieldName: string = `${parentName}-${name}`;

    return (
      <Controller
        disabled={!!validations?.read_only}
        control={form.control}
        name={fieldName}
        defaultValue={value ?? ""}
        render={({ field }) => (
          <div className="hidden">
            <Label className="ellipsis" title={label}>
              {label}
              {!!validations?.mandatory && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              type="hidden"
              placeholder={label}
              {...field}
              aria-hidden={true}
            />
          </div>
        )}
      />
    );
  }
);

HiddenField.displayName = "HiddenField";

const InputField: React.FC<FieldRenderProps> = memo(({ field, parentName }) => {
  const form = useFormContext(); // retrieve all hook methods
  const { name, label, validations, value, type } = field;

  const fieldName: string = `${parentName}-${name}`;

  const isDigit = (value: string) => {
    const digitRegex = /^\d+$/;
    return digitRegex.test(value) || "Only numbers are allowed";
  };
  const getValidationRules = useCallback(
    ({
      label,
      type,
      validations,
    }: {
      label: string;
      type: string;
      validations: {
        read_only?: boolean;
        mandatory?: boolean;
        min_length?: number;
        isDigit?: (value: string) => boolean | string;
      };
    }) => {
      const baseRules = {
        required: !!validations?.mandatory && `${label} is required`,
        minLength: validations?.min_length
          ? {
              value: validations.min_length,
              message: `${label} must be at least ${validations.min_length} characters long`,
            }
          : undefined,
        validate: validations?.isDigit ? isDigit : undefined,
      };
      if (label === "Email" || type === "email") {
        // @ts-expect-error
        baseRules.pattern = {
          value: emailPattern,
          message: `${label} must be a valid email address`,
        };
      }

      return baseRules;
    },
    []
  );

  // @ts-expect-error
  const validationRules = getValidationRules({ label, type, validations });

  return (
    <Controller
      // disabled={!!validations?.read_only || isLoading}
      disabled={!!validations?.read_only}
      rules={validationRules}
      control={form.control}
      name={fieldName}
      defaultValue={value ?? ""}
      render={({
        field,
        fieldState: { error, invalid },
        // formState: { isSubmitting },
      }) => (
        <div className="flex flex-col gap-2">
          <Label className="ellipsis" title={label}>
            {label}
            {!!validations?.mandatory && (
              <span className="text-red-500">*</span>
            )}
          </Label>
          <Input
            type="text"
            placeholder={label}
            {...field}
            aria-invalid={invalid}
          />
          {
            <p className="text-red-500 font-sans text-xs font-semibold ">
              {error?.message}
            </p>
          }
        </div>
      )}
    />
  );
});

InputField.displayName = "InputField";

const DropDownField: React.FC<FieldRenderProps> = memo(
  ({ field, parentName }) => {
    const [menuPortalTarget, setMenuPortalTarget] =
      useState<null | HTMLElement>(null);
    const form = useFormContext(); // retrieve all hook methods
    const {
      name,
      label,
      validations,
      value,
      options,
      dependent_elements = [],
    } = field;

    const fieldName: string = `${parentName}-${name}`;

    let getStateValue = useMemo(
      () => form.watch(fieldName),
      [form.watch(fieldName)]
    );

    const dependantElements = useMemo(
      () =>
        dependent_elements.filter((a) => a?.dependent_value === getStateValue),
      [getStateValue]
    );

    useEffect(() => {
      if (typeof document !== "undefined") {
        setMenuPortalTarget(document.querySelector("body"));
      }
    }, []);

    let renderOpt = options?.map((x: string) => ({
      label: x,
      value: x,
    }));
    return (
      <>
        <div
          className={
            !!dependent_elements?.length
              ? "col-span-12 grid grid-cols-3 gap-4 p-2"
              : ""
          }
        >
          <Controller
            control={form.control}
            name={fieldName}
            // disabled={!!validations?.read_only || isLoading}
            disabled={!!validations?.read_only}
            rules={{
              required: !!validations?.mandatory && label + " is required",
              minLength: validations?.min_length,
            }}
            defaultValue={value ?? ""}
            render={({
              field: { value, onChange, onBlur, ...rest },
              fieldState: { error, invalid },
              // formState: { isSubmitting },
            }) => (
              <div className="flex flex-col gap-2">
                <Label className="ellipsis" title={label}>
                  {label}
                  {!!validations?.mandatory && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <AutoSelect
                  options={renderOpt}
                  className={!!invalid ? "[&>div]:bg-red-500/20" : ""}
                  menuPosition="fixed"
                  onBlur={onBlur}
                  placeholder="Select an option"
                  menuPortalTarget={menuPortalTarget}
                  menuShouldBlockScroll
                  isDisabled={rest.disabled}
                  {...rest}
                  defaultValue={value && { label: value, value: value }}
                  onChange={(val: any) => {
                    onChange(val?.value);
                    form.setValue(fieldName, val?.value);
                  }}
                />
                {
                  <p className="text-red-500 font-sans text-xs font-semibold ">
                    {error?.message}
                  </p>
                }
              </div>
            )}
          />
        </div>

        {!!dependantElements?.length && (
          <div className="col-span-12">
            {dependantElements?.map((a: Field, i: number) => (
              <FormRenderer field={a} ind={i} parentName={fieldName} />
            ))}
          </div>
        )}
      </>
    );
  }
);

DropDownField.displayName = "DropDownField";

// Date picker
const DatePickerField: React.FC<FieldRenderProps> = memo(
  ({ field, parentName }) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const form = useFormContext(); // retrieve all hook methods
    const { name, label, validations, value } = field;

    const fieldName = `${parentName}-${name}`;

    const checkMinMaxDate: WhenType = validations?.when || "before"; // Providing a default value of 'before' if validations?.when is undefined

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

    const calculateDateRange = (checkMinMaxDate: WhenType) => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      let fromDate, toDate;

      if (checkMinMaxDate === "after") {
        fromDate = new Date(
          currentYear,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        toDate = new Date(
          currentYear + 100,
          currentDate.getMonth(),
          currentDate.getDate()
        );
      } else if (checkMinMaxDate === "before") {
        fromDate = new Date(
          currentYear - 100,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        toDate = new Date(
          currentYear,
          currentDate.getMonth(),
          currentDate.getDate()
        );
      } else {
        // Default range: 100 years centered around the current date
        fromDate = new Date(
          currentYear - 50,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        toDate = new Date(
          currentYear + 50,
          currentDate.getMonth(),
          currentDate.getDate()
        );
      }

      return { fromDate, toDate };
    };

    const getParsedDate = (value: string) =>
      new Date(value.split("-").reverse().join("-")).toISOString();

    useEffect(() => {
      if (!value) return;
      let parsedDate = getParsedDate(value);
      setSelectedDate(parsedDate);
    }, [value]);

    return (
      <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Controller
            disabled={validations?.read_only}
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
            render={({
              field: { onChange, value, ref, ...args },
              fieldState: { invalid, error },
            }) => (
              <div className="flex flex-col gap-2">
                <Label className="ellipsis" title={label}>
                  {label}
                  {!!validations?.mandatory && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <InputMask
                  mask="99-99-9999"
                  disabled={args.disabled}
                  onChange={(e) => {
                    onChange(e);
                    let inputValue = e.target.value;
                    const parsedDate = parse(
                      inputValue,
                      "dd-MM-yyyy",
                      new Date()
                    );

                    // Check if the parsed date is valid
                    if (isValid(parsedDate)) {
                      setSelectedDate(parsedDate as unknown as string); // Update the selectedDate state with the parsed date
                    }
                  }}
                  value={value}
                  className="relative"
                  {...args}
                >
                  {/*  @ts-expect-error */}
                  {(inputProps: HTMLInputElement) => (
                    <div className="relative">
                      {/*  @ts-expect-error */}
                      <Input
                        {...inputProps}
                        ref={ref}
                        placeholder={label}
                        className={invalid ? "bg-red-500/20" : ""}
                      />
                      <CalendarIcon
                        onClick={() => setIsOpen(true)}
                        className="absolute right-3 z-[1] cursor-pointer translate-y-[-50%] top-[50%] h-4 w-4 opacity-50"
                      />
                    </div>
                  )}
                </InputMask>
                {
                  <p className="text-red-500 font-sans text-xs font-semibold ">
                    {error?.message}
                  </p>
                }
              </div>
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
                defaultMonth={
                  selectedDate ? new Date(selectedDate as string) : new Date()
                }
                captionLayout="dropdown-buttons"
                {...calculateDateRange(checkMinMaxDate)}
                mode="single"
                // @ts-ignore
                selected={new Date(selectedDate)}
                onSelect={(date: any) => {
                  if (!date) return;
                  // @ts-ignore
                  let val = format(date, "dd-MM-yyyy");
                  form.setValue(fieldName, val, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                  setSelectedDate(date);
                  setIsOpen(false);
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

DatePickerField.displayName = "DatePickerField";
