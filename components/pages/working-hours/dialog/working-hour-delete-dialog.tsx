"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { WorkingHourItem } from "@/types/working-hours/working-hour.type";
import {
  getWeekdayLabel,
  normalizeTimeValue,
} from "@/utils/working-hours/working-hour-mappers";

type WorkingHourDeleteDialogProps = {
  open: boolean;
  workingHour?: WorkingHourItem | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (workingHour: WorkingHourItem) => Promise<void>;
};

export function WorkingHourDeleteDialog({
  open,
  workingHour,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: WorkingHourDeleteDialogProps) {
  if (!workingHour) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Eliminar horario</DialogTitle>
          <DialogDescription>
            Esta acción eliminará el horario seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-900">
            {workingHour.veterinarian_name || "Veterinario"}
          </p>
          <p className="text-sm text-slate-500">
            {getWeekdayLabel(workingHour.weekday)} · {normalizeTimeValue(workingHour.start_time)} - {normalizeTimeValue(workingHour.end_time)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Bloques: <span className="font-medium">{workingHour.slot_minutes} min</span>
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={async () => {
              await onConfirm(workingHour);
              onOpenChange(false);
            }}
          >
            {isSubmitting ? "Eliminando..." : "Eliminar horario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}