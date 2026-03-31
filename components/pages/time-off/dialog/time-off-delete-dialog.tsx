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

import type { TimeOffItem } from "@/types/time-off/time-off.type";
import { formatTimeOffDate } from "@/utils/time-off/time-off-mappers";

type TimeOffDeleteDialogProps = {
  open: boolean;
  timeOffItem?: TimeOffItem | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (timeOffItem: TimeOffItem) => Promise<void>;
};

export function TimeOffDeleteDialog({
  open,
  timeOffItem,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: TimeOffDeleteDialogProps) {
  if (!timeOffItem) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Eliminar día libre</DialogTitle>
          <DialogDescription>
            Esta acción eliminará el bloqueo seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-900">
            {timeOffItem.full_name}
          </p>
          <p className="text-sm text-slate-500">{timeOffItem.email}</p>
          <p className="mt-2 text-xs text-slate-500">
            Desde: <span className="font-medium">{formatTimeOffDate(timeOffItem.starts_at)}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Hasta: <span className="font-medium">{formatTimeOffDate(timeOffItem.ends_at)}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Motivo: <span className="font-medium">{timeOffItem.reason || "-"}</span>
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
              await onConfirm(timeOffItem);
              onOpenChange(false);
            }}
          >
            {isSubmitting ? "Eliminando..." : "Eliminar bloqueo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}