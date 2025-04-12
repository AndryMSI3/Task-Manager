"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId, useState, forwardRef } from "react";

type PropsType = {
  label: string;
  items: { value: string; label: string }[];
  prefixIcon?: React.ReactNode;
  className?: string;
  selectStyle?: React.CSSProperties;
} & (
  | { placeholder?: string; defaultValue: string }
  | { placeholder: string; defaultValue?: string }
);

export const Select = forwardRef<HTMLSelectElement, PropsType>(
  ({ items, label, defaultValue, placeholder, prefixIcon, className, selectStyle }, ref) => {
    const id = useId();
    const [isOptionSelected, setIsOptionSelected] = useState(false);

    return (
      <div className={cn("space-y-3", className)}>
        <label
          htmlFor={id}
          className="block text-body-sm font-medium text-dark dark:text-white"
        >
          {label}
        </label>

        <div style={{ marginTop:"5px" }} className="relative">
          {prefixIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              {prefixIcon}
            </div>
          )}

          <select
            ref={ref}
            id={id}
            defaultValue={defaultValue || ""}
            onChange={() => setIsOptionSelected(true)}
            style={selectStyle}
            className={cn(
              `w-full 
              appearance-none 
              rounded-lg 
              border-[1.5px] 
              border-stroke 
              bg-transparent 
              px-5.5 py-3 
              outline-none 
              transition 
              focus:border-primary 
              active:border-primary 
              dark:border-dark-3 
              dark:bg-dark-2 
              dark:focus:border-primary 
              [&>option]:text-dark-5 
              dark:[&>option]:text-dark-6`,
              isOptionSelected && "text-dark dark:text-white",
              prefixIcon && "pl-11.5",
            )}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}

            {items.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180" />
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
