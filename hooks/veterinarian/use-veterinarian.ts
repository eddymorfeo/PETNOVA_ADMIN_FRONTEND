"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createVeterinarian,
  deleteVeterinarian,
  fetchVeterinarianSpecialties,
  fetchVeterinarianUsers,
  fetchVeterinarians,
  updateVeterinarian,
} from "@/api/veterinarian/veterinarian.api";
import type {
  CreateVeterinarianPayload,
  UpdateVeterinarianPayload,
  VeterinarianItem,
  VeterinarianSpecialtyOption,
  VeterinarianUserOption,
} from "@/types/veterinarian/veterinarian.type";
import { buildVeterinarianStats } from "@/utils/veterinarian/veterinarian-mappers";
import { withProcessToast } from "@/lib/feedback/process-toast";

export function useVeterinarian() {
  const [veterinarians, setVeterinarians] = useState<VeterinarianItem[]>([]);
  const [users, setUsers] = useState<VeterinarianUserOption[]>([]);
  const [specialties, setSpecialties] = useState<VeterinarianSpecialtyOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadVeterinarianData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [veterinariansResponse, usersResponse, specialtiesResponse] =
        await Promise.all([
          fetchVeterinarians(),
          fetchVeterinarianUsers(),
          fetchVeterinarianSpecialties(),
        ]);

      setVeterinarians(veterinariansResponse);
      setUsers(usersResponse.filter((item) => item.is_active));
      setSpecialties(specialtiesResponse.filter((item) => item.is_active));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVeterinarianData();
  }, [loadVeterinarianData]);

  const handleCreateVeterinarian = useCallback(
    async (payload: CreateVeterinarianPayload) => {
      setIsMutating(true);

      try {
        await withProcessToast(
          async () => {
            await createVeterinarian(payload);
            await loadVeterinarianData();
          },
          {
            loading: "Creando veterinario...",
            success: "Veterinario creado correctamente",
            successDescription: "El profesional quedó disponible en el sistema.",
            error: "No se pudo crear el veterinario",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadVeterinarianData],
  );

  const handleUpdateVeterinarian = useCallback(
    async (veterinarianId: string, payload: UpdateVeterinarianPayload) => {
      setIsMutating(true);

      try {
        await withProcessToast(
          async () => {
            await updateVeterinarian(veterinarianId, payload);
            await loadVeterinarianData();
          },
          {
            loading: "Actualizando veterinario...",
            success: "Veterinario actualizado correctamente",
            successDescription: "Los datos del profesional fueron guardados.",
            error: "No se pudo actualizar el veterinario",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadVeterinarianData],
  );

  const handleDeleteVeterinarian = useCallback(
    async (veterinarian: VeterinarianItem) => {
      setIsMutating(true);

      try {
        await withProcessToast(
          async () => {
            await deleteVeterinarian(veterinarian.id);
            await loadVeterinarianData();
          },
          {
            loading: "Desactivando veterinario...",
            success: "Veterinario desactivado correctamente",
            successDescription: "El profesional ya no figura como activo.",
            error: "No se pudo desactivar el veterinario",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadVeterinarianData],
  );

  const { totalVeterinarians, activeVeterinarians } = useMemo(
    () => buildVeterinarianStats(veterinarians),
    [veterinarians],
  );

  return {
    veterinarians,
    users,
    specialties,
    isLoading,
    isMutating,
    totalVeterinarians,
    activeVeterinarians,
    handleCreateVeterinarian,
    handleUpdateVeterinarian,
    handleDeleteVeterinarian,
  };
}
