import { Command as CommandPrimitive } from "cmdk";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";

import { Skeleton } from "./skeleton";

import { cn } from "@/lib/utils";
import { AutoSelectInput } from "@/types";

export type Option = Record<"value" | "label", string> & Record<string, string>;

type AutoCompleteProps = AutoSelectInput & {
  options: Option[];
  emptyMessage: string;
  value?: Option;
  name: string;
  onValueChange?: (value: Option) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  renderSelectedItemIcon?: (option: Option) => React.ReactNode;
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
  label,
  name,
  renderSelectedItemIcon,
  ...props
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option>(value as Option);
  const [inputValue, setInputValue] = useState<string>(value?.label || "");

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      const list = listRef.current;
      if (!input) {
        return;
      }
      if (list) {
        list.scrollTop = 0;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find(
          (option) => option.label === input.value
        );
        if (optionToSelect) {
          setSelected(optionToSelect);
          onValueChange?.(optionToSelect);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onValueChange]
  );
  useMemo(() => {
    setInputValue(value?.value ? selected?.label : "");
    !value?.value &&
      setSelected({
        label: "",
        value: "",
      });
  }, [value?.value]);

  const handleFocus = useCallback(() => {
    setOpen(true);
    setInputValue("");
  }, []);

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue(value?.value ? selected?.label : "");
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);

      setSelected(selectedOption);
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange]
  );

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <input type="hidden" name={name} value={value?.value ?? ""} />
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base"
          label={label ?? ""}
          {...props}
        />
      </div>
      <div className="relative mt-1">
        {isOpen ? (
          <div className="animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-stone-50 outline-none">
            <CommandList
              className="rounded-lg ring-1 ring-slate-200"
              ref={listRef}
            >
              {isLoading ? (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              ) : null}
              {options.length > 0 && !isLoading ? (
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = selected?.value === option.value;
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onSelect={() => handleSelectOption(option)}
                        className={cn(
                          "flex w-full items-center gap-2 "
                          // !isSelected ? "pl-8" : null,
                        )}
                      >
                        {renderSelectedItemIcon &&
                          renderSelectedItemIcon(option)}
                        {option.label}
                        {/* {isSelected ? <Check className="w-4" /> : null} */}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                  {emptyMessage}
                </CommandPrimitive.Empty>
              ) : null}
            </CommandList>
          </div>
        ) : (
          <CommandList />
        )}
      </div>
    </CommandPrimitive>
  );
};

export default AutoComplete;
