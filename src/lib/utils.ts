import { clsx, type ClassValue } from 'clsx'
import { NextRequest } from 'next/server'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getQueryParams<T extends Record<string, string | number>>(request: NextRequest) {
  const params = {} as T

  request.nextUrl.searchParams.forEach((value, key) => {
    const num = Number(value)
    params[key as keyof T] = (Number.isNaN(num) ? value : num) as T[keyof T]
  })

  return params
}
