"use client";

import { useMemo, useState } from "react";
import { Shield, UsersRound } from "lucide-react";
import { UserFormDialog } from "@/components/pages/users/dialogs/user-form-dialog";
import { useUsers } from "@/hooks/users/use-users";
import { buildUsersColumns } from "@/components/pages/users/table/users-columns";
import { UsersDataTable } from "@/components/pages/users/table/users-data-table";
import type { UserItem } from "@/types/users/user.type";

export function UsersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  const {
    users,
    isLoading,
    isMutating,
    activeUsersCount,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useUsers();

  const columns = useMemo(
    () =>
      buildUsersColumns({
        onEdit: (user) => setEditingUser(user),
        onDelete: (user) => {
          void handleDeleteUser(user);
        },
      }),
    [handleDeleteUser],
  );

  return (
    <section className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Gestión de usuarios
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Administra cuentas internas del portal, su estado y la información base
            de acceso.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Usuarios registrados</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {users.length}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <UsersRound className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Usuarios activos</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {activeUsersCount}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Shield className="size-5" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Cargando usuarios...
        </div>
      ) : (
        <UsersDataTable
          columns={columns}
          data={users}
          onCreate={() => setIsCreateDialogOpen(true)}
        />
      )}

      <UserFormDialog
        mode="create"
        open={isCreateDialogOpen}
        isSubmitting={isMutating}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={async (values) => {
          await handleCreateUser(values);
        }}
        onUpdate={async () => undefined}
      />

      <UserFormDialog
        mode="edit"
        open={Boolean(editingUser)}
        user={editingUser}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setEditingUser(null);
          }
        }}
        onCreate={async () => undefined}
        onUpdate={async (userId, values) => {
          await handleUpdateUser(userId, values);
          setEditingUser(null);
        }}
      />
    </section>
  );
}