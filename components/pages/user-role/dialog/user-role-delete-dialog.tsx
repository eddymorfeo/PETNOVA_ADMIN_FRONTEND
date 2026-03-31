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

import type { UserRoleItem } from "@/types/user-role/user-role-type";

type UserRoleDeleteDialogProps = {
  open: boolean;
  userRole?: UserRoleItem | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userRole: UserRoleItem) => Promise<void>;
};

export function UserRoleDeleteDialog({
  open,
  userRole,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: UserRoleDeleteDialogProps) {
  if (!userRole) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Eliminar asignación</DialogTitle>
          <DialogDescription>
            Esta acción eliminará la asignación del rol seleccionada.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-900">
            {userRole.full_name}
          </p>
          <p className="text-sm text-slate-500">{userRole.email}</p>
          <p className="mt-2 text-xs text-slate-500">
            Rol actual: <span className="font-medium">{userRole.role_name}</span>
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
              await onConfirm(userRole);
              onOpenChange(false);
            }}
          >
            {isSubmitting ? "Eliminando..." : "Eliminar asignación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}