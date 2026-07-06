import React from "react";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "dateSchedule"
  | "date-range"
  | "file";

export type FormField = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  isDisabled?: boolean;
  accept?: string; // ✅ optional file types
  multiple?: boolean; // ✅ allow multiple files
};

interface ReusableFormProps {
  fields: FormField[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText?: string;
  loading?: boolean;
  footer?: React.ReactNode;
  isDisabled?: boolean;
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

export default function Form({
  fields,
  values,
  onChange,
  onSubmit,
  footer,
  isDisabled,
}: ReusableFormProps) {
  const renderField = (field: FormField) => {
    const commonProps = {
      placeholder: field.placeholder,
      className:
        "input-field w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
      disabled: isDisabled,
    };

    switch (field.type) {
      case "file":
        return (
          <input
            type="file"
            accept={field.accept}
            multiple={field.multiple}
            disabled={isDisabled}
            placeholder={field.placeholder}
            onChange={(e) => {
              const files = e.target.files;
              // onChange(field.name, field.multiple ? files : files?.[0]);
              onChange(field.name, files ? (field.multiple ? Array.from(files) : files[0]) : null);
            }}
            className="input-field w-full border rounded-lg px-4 py-2"
          />
        );

      case "textarea":
        return (
          <textarea
            {...commonProps}
            value={values[field.name] || ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            rows={4}
          />
        );

      case "select":
        return (
          <select
            {...commonProps}
            value={values[field.name] || ""}
            onChange={(e) => onChange(field.name, e.target.value)}
          >
            <option value="">Select an option</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "dateSchedule":
        return (
          <input
            type="datetime-local"
            {...commonProps}
            value={
              values[field.name] ? toDateTimeLocal(values[field.name]) : ""
            }
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );

      case "date-range":
        return (
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={values[field.name]?.from || ""}
              onChange={(e) =>
                onChange(field.name, {
                  ...values[field.name],
                  from: e.target.value,
                })
              }
              className="input-field w-full border rounded-lg px-4 py-2"
            />

            <span className="text-gray-500">to</span>

            <input
              type="date"
              value={values[field.name]?.to || ""}
              onChange={(e) =>
                onChange(field.name, {
                  ...values[field.name],
                  to: e.target.value,
                })
              }
              className="input-field w-full border rounded-lg px-4 py-2"
            />
          </div>
        );

      case "text":
        return (
          <input
            type="text"
            {...commonProps}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="input-field w-full border rounded-lg px-4 py-2"
          />
        );
      case "password":
        return (
          <input
            type="password"
            {...commonProps}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="input-field w-full border rounded-lg px-4 py-2"
          />
        );

      default:
        return <input type={field.type || "text"} {...commonProps} />;
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
          </label>

          {renderField(field)}
        </div>
      ))}

      {footer && <div className="pt-4">{footer}</div>}
    </form>
  );
}
