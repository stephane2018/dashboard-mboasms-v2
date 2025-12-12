"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Add, Minus } from "iconsax-react"
import { cn } from "@/lib/utils"

interface SMSQuantityInputProps {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    step?: number
    label?: string
    className?: string
    disabled?: boolean
}

export function SMSQuantityInput({
    value,
    onChange,
    min = 1,
    max = 1000000,
    step = 100,
    label = "Nombre de SMS",
    className,
    disabled = false
}: SMSQuantityInputProps) {
    const [inputValue, setInputValue] = useState(value.toString())

    useEffect(() => {
        setInputValue(value.toString())
    }, [value])

    const handleIncrement = () => {
        const newValue = Math.min(value + step, max)
        onChange(newValue)
    }

    const handleDecrement = () => {
        const newValue = Math.max(value - step, min)
        onChange(newValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setInputValue(val)

        // Only update if it's a valid number
        const numValue = parseInt(val, 10)
        if (!isNaN(numValue) && numValue >= min && numValue <= max) {
            onChange(numValue)
        }
    }

    const handleInputBlur = () => {
        const numValue = parseInt(inputValue, 10)
        if (isNaN(numValue) || numValue < min) {
            onChange(min)
            setInputValue(min.toString())
        } else if (numValue > max) {
            onChange(max)
            setInputValue(max.toString())
        } else {
            onChange(numValue)
            setInputValue(numValue.toString())
        }
    }

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label className="text-sm font-medium">{label}</Label>
            )}
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleDecrement}
                    disabled={disabled || value <= min}
                    className="h-12 w-12 shrink-0"
                >
                    <Minus size={20} variant="Bulk" color="currentColor" />
                </Button>
                <Input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    disabled={disabled}
                    min={min}
                    max={max}
                    className="h-12 text-center text-lg font-semibold"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={disabled || value >= max}
                    className="h-12 w-12 shrink-0"
                >
                    <Add size={20} variant="Bulk" color="currentColor" />
                </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
                Min: {min.toLocaleString()} | Max: {max.toLocaleString()}
            </p>
        </div>
    )
}
