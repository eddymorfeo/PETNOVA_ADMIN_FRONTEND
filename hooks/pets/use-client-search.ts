"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { fetchClients } from "@/api/clients/clients.api";
import type { ClientItem } from "@/types/clients/client.type";
import type { PetClientOption } from "@/types/pets/pet.type";

function mapClientToPetClientOption(client: ClientItem): PetClientOption {
  return {
    id: client.id,
    full_name: client.full_name,
    document_id: client.document_id ?? null,
    email: client.email,
    phone: client.phone ?? null,
    is_active: client.is_active,
  };
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

export function useClientSearch() {
  const [clients, setClients] = useState<PetClientOption[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetchClients();

      const normalizedClients = response
        .map(mapClientToPetClientOption)
        .filter((client) => client.is_active);

      setClients(normalizedClients);
      setHasLoaded(true);
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

  const filteredClients = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return clients;
    }

    return clients.filter((client) => {
      const fullName = normalizeText(client.full_name);
      const documentId = normalizeText(client.document_id ?? "");
      const email = normalizeText(client.email);
      const phone = normalizeText(client.phone ?? "");

      return (
        fullName.includes(normalizedQuery) ||
        documentId.includes(normalizedQuery) ||
        email.includes(normalizedQuery) ||
        phone.includes(normalizedQuery)
      );
    });
  }, [clients, query]);

  return {
    clients,
    filteredClients,
    query,
    setQuery,
    isLoading,
    hasLoaded,
    loadClients,
  };
}