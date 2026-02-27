import { Slider as ShadcnSlider } from '@/src/components/ui/slider'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip'
import { ComponentProps, useState } from 'react'
import { Slider as SliderPrimitive } from 'radix-ui'

export function Slider({
  value,
  onValueChange,
  maxValue,
  minValue,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root> & { maxValue?: number; minValue?: number }) {
  const [isPoenTooltip, setIsOpenTooltip] = useState(false)
  const [tooltipValue, setTooltipValue] = useState(0)
  return (
    <Tooltip open={isPoenTooltip}>
      <TooltipTrigger asChild className="w-1/4">
        <ShadcnSlider
          value={value}
          {...props}
          onValueChange={([value]) => {
            if (minValue && value < minValue) return
            if (maxValue && value > maxValue) return
            if (onValueChange) onValueChange([value])
            if (!value) setTooltipValue(value)
          }}
          onPointerEnter={() => setIsOpenTooltip(true)}
          onPointerLeave={() => setIsOpenTooltip(false)}
        />
      </TooltipTrigger>
      <TooltipContent>{value?.[0] || tooltipValue}</TooltipContent>
    </Tooltip>
  )
}
