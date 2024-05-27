/* ----------- async-select.jsx ----------- */
import * as React from "react";
import Async from "react-select/async";
// @ts-expect-error
import type { Props } from "react-select/async";
import { defaultClassNames, defaultStyles } from "@/lib/helper";
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
  Option,
} from "./components";


interface Option {
  label: string;
  value: string;
}


const AsyncSelect = React.forwardRef((props: Props, ref) => {
  const {
    value,
    onChange,
    styles = defaultStyles,
    classNames = defaultClassNames,
    loadOptions,
    components = {},
    ...rest
  } = props;

  const loadOptionsDebounced = React.useCallback(
    (inputValue: string, callback: (options: Option[]) => void) => {
      setTimeout(() => {
        loadOptions(inputValue, callback);
      }, 300); // debounce timeout
    },
    [loadOptions]
  );

  return (
    <Async
      ref={ref}
      value={value}
      onChange={onChange}
      unstyled
      loadOptions={loadOptionsDebounced}
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
export default AsyncSelect;
