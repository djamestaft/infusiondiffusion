"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FieldControlProps = {
  id?: string;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

interface FieldProps extends React.ComponentProps<"div"> {
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  children: React.ReactElement<FieldControlProps>;
}

function Field({
  label,
  description,
  error,
  optional = false,
  required = false,
  children,
  className,
  ...props
}: FieldProps) {
  const generatedId = React.useId();
  const controlId = children.props.id ?? `${generatedId}-control`;
  const messageId = `${generatedId}-${error ? "error" : "description"}`;
  const describedBy = [
    children.props["aria-describedby"],
    error || description ? messageId : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const control = React.cloneElement(children, {
    id: controlId,
    required: required || children.props.required || undefined,
    "aria-invalid": error ? true : children.props["aria-invalid"],
    "aria-describedby": describedBy || undefined,
  });

  return (
    <div data-slot="field" className={cn("grid gap-2", className)} {...props}>
      <label
        data-slot="field-label"
        htmlFor={controlId}
        className="text-field-text font-sans text-sm leading-5 font-semibold"
      >
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {optional && !required ? (
          <span className="text-field-placeholder font-normal">
            {" "}
            · Optional
          </span>
        ) : null}
      </label>
      {control}
      {error ? (
        <p
          id={messageId}
          data-slot="field-error"
          className="text-field-error-text font-sans text-sm leading-5"
        >
          <span aria-hidden="true">Error: </span>
          {error}
        </p>
      ) : description ? (
        <p
          id={messageId}
          data-slot="field-description"
          className="text-field-placeholder font-sans text-sm leading-5"
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { Field, type FieldProps };
