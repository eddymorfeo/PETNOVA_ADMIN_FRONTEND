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
        const createdClient = await createClient(payload);

        setClients((currentClients) => [createdClient, ...currentClients]);

        toast.success("Cliente creado correctamente", {
          description: `Se registró a ${createdClient.full_name}.`,
        });

        return createdClient;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No fue posible crear el cliente.";

        await Swal.fire({
          icon: "error",
          title: "No se pudo crear el cliente",
          text: message,
          confirmButtonColor: "#2563eb",
        });

        throw error;
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
        const updatedClient = await updateClient(clientId, payload);

        setClients((currentClients) =>
          currentClients.map((client) =>
            client.id === clientId ? updatedClient : client,
          ),
        );

        toast.success("Cliente actualizado", {
          description: `Se actualizó a ${updatedClient.full_name}.`,
        });

        return updatedClient;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No fue posible actualizar el cliente.";

        await Swal.fire({
          icon: "error",
          title: "No se pudo actualizar el cliente",
          text: message,
          confirmButtonColor: "#2563eb",
        });

        throw error;
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
      const deletedClient = await deleteClient(client.id);

      setClients((currentClients) =>
        currentClients.map((currentClient) =>
          currentClient.id === client.id ? deletedClient : currentClient,
        ),
      );

      toast.success("Cliente desactivado", {
        description: `${deletedClient.full_name} fue desactivado correctamente.`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible desactivar el cliente.";

      await Swal.fire({
        icon: "error",
        title: "No se pudo desactivar el cliente",
        text: message,
        confirmButtonColor: "#2563eb",
      });
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