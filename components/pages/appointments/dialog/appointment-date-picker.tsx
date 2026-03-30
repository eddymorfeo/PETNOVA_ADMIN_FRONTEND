"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AppointmentDatePickerProps = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function parseDateOnly(value: string): Date | undefined {
  if (!value) return undefined;

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

function formatDateToInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function AppointmentDatePicker({
  value,
  disabled,
  onChange,
}: AppointmentDatePickerProps) {
  const selectedDate = parseDateOnly(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-11 w-full justify-between rounded-xl border-slate-200 bg-white px-3 text-left font-normal",
            !value && "text-slate-500",
          )}
        >
          {selectedDate
            ? format(selectedDate, "dd-MM-yyyy", { locale: es })
            : "Seleccionar fecha"}
          <CalendarIcon className="size-4 text-slate-500" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (!date) return;
            onChange(formatDateToInputValue(date));
          }}
          disabled={(date) => date < today}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}