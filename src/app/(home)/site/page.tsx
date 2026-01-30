'use client'

import { Button } from '@/src/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet
} from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useForm, SubmitHandler, FieldValues, Controller } from 'react-hook-form'
import { useEffect, useRef } from 'react'

export default function Test() {
  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onChange' })
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data, errors)
  }

  const handleValidate = (_: unknown, formValues: FieldValues) => {
    const { storage, cookie } = formValues
    return storage || cookie ? true : 'You must agree to the terms and conditions'
  }

  const watchFields = watch(['storage', 'cookie'], { storage: '', cookie: '' })
  const isFirst = useRef(true)
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    trigger(['storage', 'cookie'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...watchFields, trigger])

  return (
    <div className="p-4 bg-secondary h-full flex justify-center items-center">
      <Card className="max-w-200 flex-1">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Apple or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <Controller
                  name="url"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Card number is required' }}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Card Number</FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="1234 5678 9012 3456"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>Enter your 16-digit card number</FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="storage"
                  control={control}
                  defaultValue=""
                  rules={{ validate: handleValidate }}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Comments</FieldLabel>
                      <Textarea
                        id={field.name}
                        placeholder="Add any additional comments"
                        className="resize-none max-h-30"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="cookie"
                  control={control}
                  defaultValue=""
                  rules={{ validate: handleValidate }}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Comments</FieldLabel>
                      <Textarea
                        id={field.name}
                        placeholder="Add any additional comments"
                        className="resize-none max-h-30"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldSet>

              <FieldSeparator />

              <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
