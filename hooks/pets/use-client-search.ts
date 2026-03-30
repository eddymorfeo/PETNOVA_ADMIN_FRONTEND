"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { searchClients } from "@/api/pets/pets.api";
import type { PetClientOption } from "@/types/pets/pet.type";

export function useClientSearch() {
  const [clients, setClients] = useState<PetClientOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    try {
      setIsSearching(true);
      const response = await searchClients(query);
      setClients(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible buscar clientes.";

      toast.error("No se pudieron buscar clientes", {
        description: message,
      });
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    clients,
    isSearching,
    handleSearch,
  };
}