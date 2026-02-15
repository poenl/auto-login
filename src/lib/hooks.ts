import { useCallback, useEffect, useState } from 'react'

// 页面聚焦是重新设置值
export const useFocus = <T>(getValue: () => T) => {
  const [val, setVal] = useState(getValue())

  const handleFocus = useCallback(() => {
    setVal(getValue())
  }, [getValue])

  useEffect(() => {
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [getValue, handleFocus])

  const updateVal = () => {
    setVal(getValue())
  }
  return [val, updateVal] as const
}
