"use client";

import { useMemo, useState } from "react";
import { Shield, UsersRound } from "lucide-react";

import { useClients } from "@/hooks/clients/use-clients";
import { buildClientsColumns } from "@/components/pages/clients/table/clients-columns";
import { ClientsDataTable } from "@/components/pages/clients/table/clients-data-table";
import type { ClientItem } from "@/types/clients/client.type";
import { ClientFormDialog } from "./dialog/client-form-dialog";

export function ClientsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);

  const {
    clients,
    isLoading,
    isMutating,
    activeClientsCount,
    handleCreateClient,
    handleUpdateClient,
    handleDeleteClient,
  } = useClients();

  const columns = useMemo(
    () =>
      buildClientsColumns({
        onEdit: (client) => setEditingClient(client),
        onDelete: (client) => void handleDeleteClient(client),
      }),
    [handleDeleteClient],
  );

  return (
    <section className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Gestión de clientes
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Administra clientes, su información base y el estado general de sus cuentas.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Clientes registrados</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {clients.length}
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
              <p className="text-sm text-slate-500">Clientes activos</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {activeClientsCount}
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
          Cargando clientes...
        </div>
      ) : (
        <ClientsDataTable
          columns={columns}
          data={clients}
          onCreate={() => setIsCreateDialogOpen(true)}
        />
      )}

      <ClientFormDialog
        mode="create"
        open={isCreateDialogOpen}
        isSubmitting={isMutating}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={async (values) => {
          await handleCreateClient(values);
        }}
        onUpdate={async () => undefined}
      />

      <ClientFormDialog
        mode="edit"
        open={Boolean(editingClient)}
        client={editingClient}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setEditingClient(null);
          }
        }}
        onCreate={async () => undefined}
        onUpdate={async (clientId, values) => {
          await handleUpdateClient(clientId, values);
          setEditingClient(null);
        }}
      />
    </section>
  );
}