"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";

import {
  createPet,
  deletePet,
  fetchBreeds,
  fetchPets,
  fetchSpecies,
  updatePet,
} from "@/api/pets/pets.api";

import type {
  BreedOption,
  CreatePetPayload,
  PetItem,
  SpeciesOption,
  UpdatePetPayload,
} from "@/types/pets/pet.type";

export function usePets() {
  const [pets, setPets] = useState<PetItem[]>([]);
  const [speciesOptions, setSpeciesOptions] = useState<SpeciesOption[]>([]);
  const [breedOptions, setBreedOptions] = useState<BreedOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadPets = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchPets();
      setPets(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible cargar las mascotas.";

      toast.error("No se pudieron cargar las mascotas", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSpecies = useCallback(async () => {
    try {
      const response = await fetchSpecies();
      setSpeciesOptions(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible cargar las especies.";

      toast.error("No se pudieron cargar las especies", {
        description: message,
      });
    }
  }, []);

  const loadBreeds = useCallback(async (speciesId?: string) => {
    try {
      const response = await fetchBreeds(speciesId);
      setBreedOptions(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible cargar las razas.";

      toast.error("No se pudieron cargar las razas", {
        description: message,
      });
    }
  }, []);

  useEffect(() => {
    void loadPets();
    void loadSpecies();
  }, [loadPets, loadSpecies]);

  const handleCreatePet = useCallback(async (payload: CreatePetPayload) => {
    try {
      setIsMutating(true);
      const createdPet = await createPet(payload);

      setPets((currentPets) => [createdPet, ...currentPets]);

      toast.success("Mascota creada correctamente", {
        description: `Se registró a ${createdPet.name}.`,
      });

      return createdPet;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible crear la mascota.";

      await Swal.fire({
        icon: "error",
        title: "No se pudo crear la mascota",
        text: message,
        confirmButtonColor: "#2563eb",
      });

      throw error;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const handleUpdatePet = useCallback(async (petId: string, payload: UpdatePetPayload) => {
    try {
      setIsMutating(true);
      const updatedPet = await updatePet(petId, payload);

      setPets((currentPets) =>
        currentPets.map((pet) => (pet.id === petId ? updatedPet : pet)),
      );

      toast.success("Mascota actualizada", {
        description: `Se actualizó ${updatedPet.name}.`,
      });

      return updatedPet;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible actualizar la mascota.";

      await Swal.fire({
        icon: "error",
        title: "No se pudo actualizar la mascota",
        text: message,
        confirmButtonColor: "#2563eb",
      });

      throw error;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const handleDeletePet = useCallback(async (pet: PetItem) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Desactivar mascota?",
      text: `Se desactivará a ${pet.name}.`,
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
      const deletedPet = await deletePet(pet.id);

      setPets((currentPets) =>
        currentPets.map((currentPet) =>
          currentPet.id === pet.id ? deletedPet : currentPet,
        ),
      );

      toast.success("Mascota desactivada", {
        description: `${deletedPet.name} fue desactivada correctamente.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible desactivar la mascota.";

      await Swal.fire({
        icon: "error",
        title: "No se pudo desactivar la mascota",
        text: message,
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsMutating(false);
    }
  }, []);

  const activePetsCount = useMemo(
    () => pets.filter((pet) => pet.is_active).length,
    [pets],
  );

  return {
    pets,
    speciesOptions,
    breedOptions,
    isLoading,
    isMutating,
    activePetsCount,
    loadPets,
    loadSpecies,
    loadBreeds,
    handleCreatePet,
    handleUpdatePet,
    handleDeletePet,
  };
}