import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn, SubmitHandler, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';

interface FormWrapperProps<T extends FieldValues> {
  children: (methods: UseFormReturn<T>) => React.ReactNode;
  onSubmit: SubmitHandler<T>;
  schema: any;
  className?: string;
  // Spread other form props manually
  [key: string]: any;
}

export function FormWrapper<T extends FieldValues>({
  children,
  onSubmit,
  schema,
  className,
  ...props
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const handleSubmit = async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      console.error('Form submission error:', error);
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    }
  };

  return (
    <form
      className={className}
      onSubmit={methods.handleSubmit(handleSubmit)}
      {...props}
    >
      {children(methods)}
    </form>
  );
}
