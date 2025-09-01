import Select from "react-select";
import type { SingleValue, MultiValue } from "react-select";
import  { forwardRef } from "react";
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
  // For file inputs
  files?: any[]; // file list for FileUpload component
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
          {...rest}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
  // Select (dropdown)
  if (type === "select") {
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
          {options.map((opt: any) => (
            <label key={opt.value} className="flex items-center gap-1">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className={className}
                ref={ref as React.Ref<HTMLInputElement>}
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

  if (type === "text" || "email" || "number") {
    return (
      <div>
        {label && <label htmlFor={name}>{label}</label>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={className + (error ? " border-red-500" : "")}
          autoFocus={autoFocus}
          placeholder={placeholder}
          ref={ref as React.Ref<HTMLInputElement>}
          {...rest}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
  // Default: text, email, number, password, date, etc.
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={className + (error ? " border-red-500" : "")}
        autoFocus={autoFocus}
        placeholder={placeholder}
        ref={ref as React.Ref<HTMLInputElement>}
        {...rest}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default DynamicInput;
