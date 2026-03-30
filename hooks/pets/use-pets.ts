"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";

import { fetchClients } from "@/api/clients/clients.api";
import {
  createPet,
  deletePet,
  fetchBreeds,
  fetchPets,
  fetchSpecies,
  updatePet,
} from "@/api/pets/pets.api";

import type { ClientItem } from "@/types/clients/client.type";
import type {
  BreedOption,
  CreatePetPayload,
  PetClientOption,
  PetItem,
  SpeciesOption,
  UpdatePetPayload,
} from "@/types/pets/pet.type";

function mapClientToPetClient(client: ClientItem): PetClientOption {
  return {
    id: client.id,
    full_name: client.full_name,
    document_id: client.document_id ?? null,
    email: client.email,
    phone: client.phone ?? null,
    is_active: client.is_active,
  };
}

function enrichPetsWithRelations(
  pets: PetItem[],
  clients: ClientItem[],
  speciesOptions: SpeciesOption[],
  breedOptions: BreedOption[],
): PetItem[] {
  const clientMap = new Map(
    clients.map((client) => [client.id, mapClientToPetClient(client)]),
  );

  const speciesMap = new Map(
    speciesOptions.map((species) => [species.id, species]),
  );

  const breedMap = new Map(
    breedOptions.map((breed) => [breed.id, breed]),
  );

  return pets.map((pet) => ({
    ...pet,
    client: clientMap.get(pet.client_id) ?? null,
    species: speciesMap.get(pet.species_id) ?? null,
    breed: pet.breed_id ? breedMap.get(pet.breed_id) ?? null : null,
  }));
}

export function usePets() {
  const [pets, setPets] = useState<PetItem[]>([]);
  const [speciesOptions, setSpeciesOptions] = useState<SpeciesOption[]>([]);
  const [breedOptions, setBreedOptions] = useState<BreedOption[]>([]);
  const [allBreedOptions, setAllBreedOptions] = useState<BreedOption[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadSpecies = useCallback(async (): Promise<SpeciesOption[]> => {
    const response = await fetchSpecies();
    setSpeciesOptions(response);
    return response;
  }, []);

  const loadAllBreeds = useCallback(async (): Promise<BreedOption[]> => {
    const response = await fetchBreeds();
    setAllBreedOptions(response);
    return response;
  }, []);

  const loadClients = useCallback(async (): Promise<ClientItem[]> => {
    const response = await fetchClients();
    setClients(response);
    return response;
  }, []);

  const loadPets = useCallback(async () => {
    try {
      setIsLoading(true);

      const [petsResponse, clientsResponse, speciesResponse, breedsResponse] =
        await Promise.all([
          fetchPets(),
          loadClients(),
          loadSpecies(),
          loadAllBreeds(),
        ]);

      setPets(
        enrichPetsWithRelations(
          petsResponse,
          clientsResponse,
          speciesResponse,
          breedsResponse,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible cargar las mascotas.";

      toast.error("No se pudieron cargar las mascotas", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadAllBreeds, loadClients, loadSpecies]);

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
  }, [loadPets]);

  const refreshPets = useCallback(async () => {
    const petsResponse = await fetchPets();
    setPets(
      enrichPetsWithRelations(
        petsResponse,
        clients,
        speciesOptions,
        allBreedOptions,
      ),
    );
  }, [allBreedOptions, clients, speciesOptions]);

  const handleCreatePet = useCallback(async (payload: CreatePetPayload) => {
    try {
      setIsMutating(true);
      await createPet(payload);
      await refreshPets();

      toast.success("Mascota creada correctamente");
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
  }, [refreshPets]);

  const handleUpdatePet = useCallback(async (petId: string, payload: UpdatePetPayload) => {
    try {
      setIsMutating(true);
      await updatePet(petId, payload);
      await refreshPets();

      toast.success("Mascota actualizada");
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
  }, [refreshPets]);

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
      await deletePet(pet.id);
      await refreshPets();

      toast.success("Mascota desactivada");
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
  }, [refreshPets]);

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