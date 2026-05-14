"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";

import {
  createClient,
  deleteClient,
  fetchClients,
  updateClient,
} from "@/api/clients/clients.api";

import type {
  ClientItem,
  CreateClientPayload,
  UpdateClientPayload,
} from "@/types/clients/client.type";
import { withProcessToast } from "@/lib/feedback/process-toast";

export function useClients() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchClients();
      setClients(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible cargar los clientes.";

      toast.error("No se pudieron cargar los clientes", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  const handleCreateClient = useCallback(
    async (payload: CreateClientPayload) => {
      try {
        setIsMutating(true);

        return await withProcessToast(
          async () => {
            const createdClient = await createClient(payload);
            setClients((currentClients) => [createdClient, ...currentClients]);
            return createdClient;
          },
          {
            loading: "Creando cliente...",
            success: "Cliente creado correctamente",
            successDescription: (client) =>
              `Se registró a ${client.full_name} en PETNOVA.`,
            error: "No se pudo crear el cliente",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [],
  );

  const handleUpdateClient = useCallback(
    async (clientId: string, payload: UpdateClientPayload) => {
      try {
        setIsMutating(true);

        return await withProcessToast(
          async () => {
            const updatedClient = await updateClient(clientId, payload);
            setClients((currentClients) =>
              currentClients.map((client) =>
                client.id === clientId ? updatedClient : client,
              ),
            );
            return updatedClient;
          },
          {
            loading: "Actualizando cliente...",
            success: "Cliente actualizado correctamente",
            successDescription: (client) =>
              `Los datos de ${client.full_name} fueron guardados.`,
            error: "No se pudo actualizar el cliente",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [],
  );

  const handleDeleteClient = useCallback(async (client: ClientItem) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Desactivar cliente?",
      text: `Se desactivará a ${client.full_name}.`,
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsMutating(true);

      await withProcessToast(
        async () => {
          const deletedClient = await deleteClient(client.id);
          setClients((currentClients) =>
            currentClients.map((currentClient) =>
              currentClient.id === client.id ? deletedClient : currentClient,
            ),
          );
          return deletedClient;
        },
        {
          loading: "Desactivando cliente...",
          success: "Cliente desactivado correctamente",
          successDescription: (deletedClient) =>
            `${deletedClient.full_name} ya no figura como cliente activo.`,
          error: "No se pudo desactivar el cliente",
        },
      );
    } finally {
      setIsMutating(false);
    }
  }, []);

  const activeClientsCount = useMemo(
    () => clients.filter((client) => client.is_active).length,
    [clients],
  );

  return {
    clients,
    isLoading,
    isMutating,
    activeClientsCount,
    loadClients,
    handleCreateClient,
    handleUpdateClient,
    handleDeleteClient,
  };
}
