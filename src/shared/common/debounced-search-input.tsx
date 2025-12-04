import { useState } from "react";
import { SearchIcon, XCircle } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useDebounceCallback } from "usehooks-ts";
import { cn } from "@/core/lib/utils";

export interface DebouncedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export function DebouncedSearchInput({
  value,
  onChange,
  placeholder = "Rechercher...",
  delay = 500,
  className,
}: DebouncedSearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  const debouncedOnChange = useDebounceCallback(onChange, delay);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setLocalValue("");
    debouncedOnChange.cancel();
    onChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
      <Input placeholder={placeholder} value={localValue} onChange={handleInputChange} className="pl-8 pr-10" />
      {localValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
        >
          <XCircle className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
