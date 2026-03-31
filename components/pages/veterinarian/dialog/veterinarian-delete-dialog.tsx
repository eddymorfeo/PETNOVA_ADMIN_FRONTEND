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

import type { VeterinarianItem } from "@/types/veterinarian/veterinarian.type";

type VeterinarianDeleteDialogProps = {
  open: boolean;
  veterinarian?: VeterinarianItem | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (veterinarian: VeterinarianItem) => Promise<void>;
};

export function VeterinarianDeleteDialog({
  open,
  veterinarian,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: VeterinarianDeleteDialogProps) {
  if (!veterinarian) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Desactivar veterinario</DialogTitle>
          <DialogDescription>
            Esta acción desactivará al veterinario seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-900">
            {veterinarian.full_name}
          </p>
          <p className="text-sm text-slate-500">{veterinarian.email}</p>
          <p className="mt-2 text-xs text-slate-500">
            Especialidad:{" "}
            <span className="font-medium">
              {veterinarian.specialty_name || "Sin especialidad"}
            </span>
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
              await onConfirm(veterinarian);
              onOpenChange(false);
            }}
          >
            {isSubmitting ? "Desactivando..." : "Desactivar veterinario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}