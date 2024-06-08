import * as React from "react";
import type {
  ClearIndicatorProps,
  DropdownIndicatorProps,
  MultiValueRemoveProps,
  OptionProps,
  InputProps,
  ValueContainerProps,
} from "react-select";
import { components } from "react-select";
import { FixedSizeList as List } from "react-window";

import {
  CaretSortIcon,
  CheckIcon,
  Cross2Icon as CloseIcon,
} from "@radix-ui/react-icons";
// import { Input, InputProps } from "./input";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretSortIcon className={"h-4 w-4 opacity-50"} />
    </components.DropdownIndicator>
  );
};
export const ClearIndicator = (props: ClearIndicatorProps) => {
  return (
    <components.ClearIndicator {...props}>
      <CloseIcon className={"h-3.5 w-3.5 opacity-50"} />
    </components.ClearIndicator>
  );
};
export const MultiValueRemove = (props: MultiValueRemoveProps) => {
  return (
    <components.MultiValueRemove {...props}>
      <CloseIcon className={"h-3 w-3 opacity-50"} />
    </components.MultiValueRemove>
  );
};
export const Option = (props: OptionProps) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between overflow-x-hidden">
        <div className="flex items-center gap-2">
          {/* @ts-expect-error */}
          {props!.data!.icon && (
            // @ts-ignore
            <Image
              height={14}
              width={24}
              className="object-contain shadow-sm h-6 "
              // @ts-ignore
              src={props!.data?.icon}
              // @ts-ignore
              alt={props!.data!.label}
            />
          )}
          {/* @ts-expect-error */}
          {props!.data!.label}
        </div>
        {props.isSelected && <CheckIcon />}
      </div>
    </components.Option>
  );
};
export const SelectInput = (props: InputProps) => {
  // @ts-expect-error
  let icon: string = props.getValue()?.[0]?.icon;
  // @ts-expect-error
  let label: string = props?.getValue()?.[0]?.label ?? "";
  return (
    <>
      {icon ? (
        <Image height={18} width={24} src={icon} alt={label} />
      ) : (
        <Search className="h-5 text-gray-500 w-4" />
      )}

      <components.Input {...props} className="w-auto" />
    </>
  );
};

export const ValueContainer = ({ children, ...props }: ValueContainerProps) => {
  let selected: any = props.getValue()?.[0];
// let valueContainerProps = {...props}
  return (
    <components.ValueContainer {...props}>
      <div className="flex gap-2" tabIndex={0}>
        {selected?.icon ? (
          // @ts-expect-error
          <Image
            height={14}
            width={24}
            className="h-3.5 object-contain my-auto shadow-sm"
            src={selected?.icon}
          />
        ) : (
          <Search className="h-5 text-gray-500 w-4" />
        )}
        {children}
        {/* {valueContainerProps.selectProps.menuIsOpen ? children?.[1] ?? children : children} */}
      </div>
    </components.ValueContainer>
  );
};
export const MenuList = (props: any) => {
  const { options, children, maxHeight, getValue } = props;
  const height = 35; // row height
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;

  return (
    // @ts-expect-error
    <List
      height={maxHeight}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};
