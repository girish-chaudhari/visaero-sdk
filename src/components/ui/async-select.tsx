/* ----------- async-select.jsx ----------- */
import * as React from "react";
import Async from "react-select/async";
// @ts-expect-error
import type { Props } from "react-select/async";
import { defaultClassNames, defaultStyles } from "@/lib/hlper";
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
  Option,
} from "./components";
const AsyncSelect = React.forwardRef((props: Props, ref) => {
  const {
    value,
    onChange,
    styles = defaultStyles,
    classNames = defaultClassNames,
    components = {},
    ...rest
  } = props;
  return (
    <Async
      ref={ref}
      value={value}
      onChange={onChange}
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
export default AsyncSelect;
