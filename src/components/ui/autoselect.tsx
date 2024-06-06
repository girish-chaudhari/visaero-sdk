import { defaultClassNames, defaultStyles } from "@/lib/helper";
import * as React from "react";
import type { Props } from "react-select";
import Select from "react-select";
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
  Option,
  SelectInput,
  ValueContainer,
} from "./components";

const AutoSelect = React.forwardRef((props: Props, ref) => {
  const {
    value,
    onChange,
    options = [],
    styles = defaultStyles,
    classNames = defaultClassNames,
    components = {},
    ...rest
  } = props;


  return (
    <Select
      // @ts-expect-error
      ref={ref}
      value={value}
      onChange={onChange}
      options={options}
      unstyled
      components={{
        DropdownIndicator,
        ClearIndicator,
        MultiValueRemove,
        Option,
        // Input: SelectInput,
        ValueContainer: ValueContainer,
        // MenuList,
        ...components,
      }}
      styles={styles}
      classNames={classNames}
      {...rest}
    />
  );
});
export default AutoSelect;
