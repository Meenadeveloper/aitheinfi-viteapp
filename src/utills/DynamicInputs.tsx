import Select from "react-select";
import type { SingleValue, MultiValue } from "react-select";
import { forwardRef } from "react";
import FileUpload from "../pages/Components/Forms/FileUpload";

interface OptionType {
  label: string;
  value: string;
}

interface DynamicInputProps {
  type: string;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
  options?: OptionType[];
  label?: string;
  autoFocus?: boolean;
  placeholder?: string;
  checked?: boolean;
  name?: string;
  multiple?: boolean;
  disabled?: boolean;
  // For file inputs
  files?: any[];
  onFilesChange?: (files: any[]) => void;
  
  [key: string]: any; // for extra/untyped props
}

const DynamicInput = forwardRef<any, DynamicInputProps>((props, ref) => {
  const {
    type,
    value,
    onChange,
    onBlur,
    error,
    className = "",
    options = [],
    label,
    autoFocus,
    placeholder,
    checked,
    multiple,
    name,
    files,
    onFilesChange,
    disabled,
    ...rest
  } = props;

  // Textarea
  if (type === "textarea") {
    return (
      <div>
        {label && <label htmlFor={name}>{label}</label>}
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={className + (error ? " border-red-500" : "")}
          autoFocus={autoFocus}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // Select (dropdown)
  if (type === "select") {
     const customStyles = {
       control: (provided: any, state: any) => ({
         ...provided,
         fontSize: "0.875rem",
         
         border: error
           ? "1px solid #ef4444" // red-500
           : state.isFocused
           ? "" // blue-500 or your custom color
           : "1px solid #e2e8f0", // slate-200
         //  boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
         "&:hover": {
           borderColor: error ? "#ef4444" : "",
         },
         placeholder: (provided: any) => ({
           ...provided,
           color: error ? "#ef4444" : "#94a3b8", // slate-400
           fontSize: "0.875rem",
         }),
         focus: (provided: any) => ({
           ...provided,
           outline: "none",

         }),
       }),
     };
    
    return (
      <div>
        {label && <label htmlFor={name}>{label}</label>}
        <Select
          name={name}
          options={options}
          className={className}
          autoFocus={autoFocus}
          ref={ref}
          isMulti={!!multiple}
          placeholder={placeholder}
          isDisabled={disabled}
          styles={customStyles}
          value={
            multiple
              ? options.filter((o: any) =>
                  (value as string[]).includes(o.value)
                )
              : options.find((o: any) => o.value === value) || null
          }
          onChange={(selected) => {
            if (multiple) {
              const multi = selected as MultiValue<OptionType>;
              onChange(multi.map((item) => item.value));
            } else {
              const single = selected as SingleValue<OptionType>;
              onChange(single ? single.value : "");
            }
          }}
          onBlur={onBlur}
          {...rest}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // Checkbox
  if (type === "checkbox") {
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className={className}
          autoFocus={autoFocus}
          ref={ref as React.Ref<HTMLInputElement>}
          disabled={disabled}
          {...rest}
        />
        <label htmlFor={name}>{label}</label>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // Radio (group)
  if (type === "radio" && options.length > 0) {
    return (
      <div>
        {label && <div className="mb-1">{label}</div>}
        <div className="flex gap-3">
          {options.map((opt: any, index: number) => (
            <label key={opt.value} className="flex items-center gap-1">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className={className}
                ref={index === 0 ? (ref as React.Ref<HTMLInputElement>) : undefined}
                autoFocus={autoFocus && index === 0}
                disabled={disabled}
                {...rest}
              />
              {opt.label}
            </label>
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // File input
  if (type === "file") {
    return (
      <FileUpload
        files={files || []}
        onFilesChange={onFilesChange || (() => {})}
        multiple={multiple}
        label={label}
        error={error}
        className={className}
        autoFocus={autoFocus}
        {...rest}
      />
    );
  }

  // Fix the condition for text/email/number types
  if (type === "text" || type === "email" || type === "number") {
    return (
      <div>
        {label && <label htmlFor={name}>{label}</label>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={
            className + (error ? " border-red-500" : "border-slate-200")
          }
          autoFocus={autoFocus}
          placeholder={placeholder}
          ref={ref as React.Ref<HTMLInputElement>}
          disabled={disabled}
          {...rest}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // Default: other input types (password, date, etc.)
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={className + (error ? " border-red-500" : "border-slate-200")}
        autoFocus={autoFocus}
        placeholder={placeholder}
        ref={ref as React.Ref<HTMLInputElement>}
        disabled={disabled}
        {...rest}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
});

DynamicInput.displayName = "DynamicInput";

export default DynamicInput;