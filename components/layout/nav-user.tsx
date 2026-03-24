"use client";

import { Mail, LogOut, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/use-auth";

export function NavUser() {
  const { session, signOut } = useAuth();

  if (!session) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <User2 className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {session.user.fullName}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Mail className="size-3.5" />
            <span className="truncate">{session.user.email}</span>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="mt-4 w-full justify-start rounded-xl"
        onClick={signOut}
      >
        <LogOut className="mr-2 size-4" />
        Cerrar sesión
      </Button>
    </div>
  );
}