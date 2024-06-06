import * as React from "react";
import type {
  ClearIndicatorProps,
  DropdownIndicatorProps,
  MultiValueRemoveProps,
  OptionProps,
} from "react-select";
import { components } from "react-select";
import { FixedSizeList as List } from "react-window";

import {
  CaretSortIcon,
  CheckIcon,
  Cross2Icon as CloseIcon,
} from "@radix-ui/react-icons";
import { Input, InputProps } from "./input";

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
  console.log(props)
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between overflow-x-hidden">
        {/* @ts-expect-error */}
        <div>{props!.data!.label}</div>
        {props.isSelected && <CheckIcon />}
      </div>
    </components.Option>
  );
};
export const SelectInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <Input {...props} ref={ref} />;
  }
);

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
