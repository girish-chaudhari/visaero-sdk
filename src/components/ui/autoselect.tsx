import * as React from "react";
import Select from "react-select";
import type { Props } from "react-select";
import { defaultClassNames, defaultStyles } from '@/lib/hlper'
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
  Option,
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
        ...components,
      }}
      styles={styles}
      classNames={classNames}
      {...rest}
    />
  );
});
export default AutoSelect;
