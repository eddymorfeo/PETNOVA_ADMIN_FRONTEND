"use client";

import { useMemo, useState } from "react";
import { Shield, UsersRound } from "lucide-react";

import { useUserRole } from "@/hooks/user-role/use-user-roles";
import { buildUserRoleColumns } from "@/components/pages/user-role/table/user-role-columns";
import { UserRoleDataTable } from "@/components/pages/user-role/table/user-role-data-table";
import type { UserRoleItem } from "@/types/user-role/user-role-type";
import { UserRoleFormDialog } from "@/components/pages/user-role/dialog/user-role-form-dialog";
import { UserRoleDeleteDialog } from "@/components/pages/user-role/dialog/user-role-delete-dialog";

export function UserRolePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deletingUserRole, setDeletingUserRole] = useState<UserRoleItem | null>(null);

  const {
    userRoles,
    users,
    roles,
    isLoading,
    isMutating,
    totalAssignments,
    totalUsersWithRoles,
    handleCreateUserRole,
    handleDeleteUserRole,
  } = useUserRole();

  const columns = useMemo(
    () =>
      buildUserRoleColumns({
        onDelete: (userRole) => setDeletingUserRole(userRole),
      }),
    [],
  );

  return (
    <section className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Asignación de roles
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Administra la asignación de roles para los usuarios del portal administrativo.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Roles asignados</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {totalAssignments}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <Shield className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Usuarios con roles</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {totalUsersWithRoles}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <UsersRound className="size-5" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Cargando asignaciones de roles...
        </div>
      ) : (
        <UserRoleDataTable
          columns={columns}
          data={userRoles}
          onCreate={() => setIsCreateDialogOpen(true)}
        />
      )}

      <UserRoleFormDialog
        open={isCreateDialogOpen}
        users={users}
        roles={roles}
        isSubmitting={isMutating}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={async (values) => {
          await handleCreateUserRole(values);
        }}
      />

      <UserRoleDeleteDialog
        open={Boolean(deletingUserRole)}
        userRole={deletingUserRole}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingUserRole(null);
          }
        }}
        onConfirm={async (userRole) => {
          await handleDeleteUserRole(userRole);
          setDeletingUserRole(null);
        }}
      />
    </section>
  );
}