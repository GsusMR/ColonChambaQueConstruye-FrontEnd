'use client';
import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export type ConfigRowProps = {
  name?: string;
  title?: string;
  valueinput?: string;
  isTitle?: boolean;
  placeholder?: string;
  isEditable?: boolean;
  editInput?: boolean;
  onEditClick?: () => void;
  onValueChange?: (v: string) => void;
  inputType?: React.HTMLInputTypeAttribute;
  rules?: any;
  externalError?: string;
};

export function ConfigRow({
  name,
  title,
  valueinput = '',
  isTitle = false,
  placeholder = '',
  isEditable = false,
  editInput = false,
  onEditClick,
  onValueChange,
  inputType,
  rules,
  externalError,
}: ConfigRowProps) {
  const methods = useFormContext();
  const inFormContext = Boolean(methods && name);

  const watchedValue = inFormContext ? methods.watch(name as any) : undefined;
  const displayValue = typeof watchedValue !== 'undefined' ? watchedValue : valueinput ?? '';

  const isPasswordField = inputType === 'password' || name === 'password';
  const maskedValue = isPasswordField ? '*************' : displayValue;

  const fieldError =
    inFormContext && name ? ((methods.formState.errors as any)[name]?.message as string | undefined) : undefined;

  const [localError, setLocalError] = useState<string | null>(null);

  const defaultRules = editInput
    ? {
        required: 'No puede quedar vacío',
        validate: (v: any) =>
          typeof v === 'string' ? v.trim() !== '' : !!v || 'No puede quedar vacío',
        ...(inputType === 'tel' || name === 'phone'
          ? { pattern: { value: /^\d+$/, message: 'Solo se permiten números' } }
          : {}),
      }
    : undefined;

  const appliedRules = rules ?? defaultRules;
  const shownError = fieldError ?? externalError ?? localError ?? undefined;

  return (
    <div
      className={`flex w-full items-center ${isTitle ? 'px-6' : 'px-4'} border-b border-zinc-100 ${
        isTitle ? 'bg-zinc-50 py-4' : ''
      }`}
    >
      {isTitle ? (
        <>
          <h3 className="flex-1 text-[16px] font-bold truncate">{title}</h3>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center min-w-0 w-full gap-2">
            <p className="w-full max-w-[150px] py-3 text-sm font-medium truncate shrink-0">{title}</p>
            <div className="flex-1 min-w-0">
              {editInput ? (
                inFormContext && name ? (
                  <Controller
                    control={methods.control}
                    name={name as any}
                    rules={appliedRules}
                    render={({ field }) => (
                      <Input
                        className="w-full rounded border px-3 py-2 text-sm"
                        placeholder={placeholder}
                        type={inputType ?? 'text'}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          if ((methods.formState.errors as any)[name]) {
                            methods.clearErrors(name as any);
                          }
                        }}
                        onBlur={(e) => {
                          const trimmed = e.target.value.trim();
                          if (trimmed !== field.value) {
                            field.onChange(trimmed);
                          }
                          field.onBlur();
                        }}
                      />
                    )}
                  />
                ) : (
                  <>
                    <Input
                      className="w-full rounded border px-3 py-2 text-sm"
                      value={displayValue}
                      placeholder={placeholder}
                      onChange={(e) => {
                        setLocalError(null);
                        onValueChange?.(e.target.value);
                      }}
                      onBlur={(e) => {
                        const trimmed = e.target.value.trim();
                        if (trimmed === '') {
                          setLocalError('No puede quedar vacío');
                        } else {
                          if (trimmed !== displayValue) onValueChange?.(trimmed);
                          setLocalError(null);
                        }
                      }}
                      type={inputType ?? 'text'}
                    />
                    {(externalError || localError) && (
                      <p className="mt-1 text-sm text-red-600">{externalError ?? localError}</p>
                    )}
                  </>
                )
              ) : (
                <div className="text-sm text-zinc-600 whitespace-normal break-words w-full">
                  {isPasswordField ? maskedValue : displayValue}
                </div>
              )}
            </div>
          </div>

          {fieldError && (
            <p className="mt-1 text-sm text-red-600 ml-[158px]">{fieldError}</p>
          )}
        </div>
      )}

      <div className={`ml-auto ${isEditable ? 'py-4' : 'py-6'} shrink-0`}>
        {isEditable && isTitle && (
          <Button onClick={onEditClick} variant="edit" color="gray">
            Editar
          </Button>
        )}
      </div>
    </div>
  );
}