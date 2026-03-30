"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";

import {
  cancelAppointment,
  createAppointment,
  fetchAppointmentTypes,
  fetchAppointments,
  fetchVeterinarians,
  updateAppointment,
} from "@/api/appointments/appointments.api";
import { fetchClients } from "@/api/clients/clients.api";
import { fetchBreeds, fetchPets, fetchSpecies } from "@/api/pets/pets.api";

import type { ClientItem } from "@/types/clients/client.type";
import type {
  AppointmentItem,
  AppointmentTypeOption,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
  VeterinarianOption,
} from "@/types/appointments/appointment-type";
import type {
  BreedOption,
  PetClientOption,
  PetItem,
  SpeciesOption,
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

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [veterinarianOptions, setVeterinarianOptions] = useState<VeterinarianOption[]>([]);
  const [appointmentTypeOptions, setAppointmentTypeOptions] = useState<AppointmentTypeOption[]>([]);
  const [clientOptions, setClientOptions] = useState<ClientItem[]>([]);
  const [petOptions, setPetOptions] = useState<PetItem[]>([]);
  const [speciesOptions, setSpeciesOptions] = useState<SpeciesOption[]>([]);
  const [breedOptions, setBreedOptions] = useState<BreedOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true);

      const [
        appointmentsResponse,
        veterinariansResponse,
        appointmentTypesResponse,
        clientsResponse,
        petsResponse,
        speciesResponse,
        breedsResponse,
      ] = await Promise.all([
        fetchAppointments(),
        fetchVeterinarians(),
        fetchAppointmentTypes(),
        fetchClients(),
        fetchPets(),
        fetchSpecies(),
        fetchBreeds(),
      ]);

      setAppointments(appointmentsResponse);
      setVeterinarianOptions(veterinariansResponse);
      setAppointmentTypeOptions(appointmentTypesResponse);
      setClientOptions(clientsResponse);
      setSpeciesOptions(speciesResponse);
      setBreedOptions(breedsResponse);

      setPetOptions(
        enrichPetsWithRelations(
          petsResponse,
          clientsResponse,
          speciesResponse,
          breedsResponse,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible cargar las citas.";

      toast.error("No se pudieron cargar las citas", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const refreshAppointmentsData = useCallback(async () => {
    const [
      appointmentsResponse,
      clientsResponse,
      petsResponse,
      speciesResponse,
      breedsResponse,
    ] = await Promise.all([
      fetchAppointments(),
      fetchClients(),
      fetchPets(),
      fetchSpecies(),
      fetchBreeds(),
    ]);

    setAppointments(appointmentsResponse);
    setClientOptions(clientsResponse);
    setSpeciesOptions(speciesResponse);
    setBreedOptions(breedsResponse);

    setPetOptions(
      enrichPetsWithRelations(
        petsResponse,
        clientsResponse,
        speciesResponse,
        breedsResponse,
      ),
    );
  }, []);

  const handleCreateAppointment = useCallback(
    async (payload: CreateAppointmentPayload) => {
      try {
        setIsMutating(true);
        await createAppointment(payload);
        await refreshAppointmentsData();

        toast.success("Cita creada correctamente");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No fue posible crear la cita.";

        await Swal.fire({
          icon: "error",
          title: "No se pudo crear la cita",
          text: message,
          confirmButtonColor: "#2563eb",
        });

        throw error;
      } finally {
        setIsMutating(false);
      }
    },
    [refreshAppointmentsData],
  );

  const handleUpdateAppointment = useCallback(
    async (appointmentId: string, payload: UpdateAppointmentPayload) => {
      try {
        setIsMutating(true);
        await updateAppointment(appointmentId, payload);
        await refreshAppointmentsData();

        toast.success("Cita actualizada");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No fue posible actualizar la cita.";

        await Swal.fire({
          icon: "error",
          title: "No se pudo actualizar la cita",
          text: message,
          confirmButtonColor: "#2563eb",
        });

        throw error;
      } finally {
        setIsMutating(false);
      }
    },
    [refreshAppointmentsData],
  );

  const handleCancelAppointment = useCallback(
    async (appointment: AppointmentItem) => {
      const result = await Swal.fire({
        icon: "warning",
        title: "¿Cancelar cita?",
        text: `Se cancelará la cita de ${appointment.client_name ?? "cliente"}.`,
        input: "textarea",
        inputLabel: "Motivo de cancelación",
        inputPlaceholder: "Escribe el motivo de cancelación...",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "Volver",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",
        reverseButtons: true,
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        setIsMutating(true);
        await cancelAppointment(appointment.id, result.value);
        await refreshAppointmentsData();

        toast.success("Cita cancelada");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No fue posible cancelar la cita.";

        await Swal.fire({
          icon: "error",
          title: "No se pudo cancelar la cita",
          text: message,
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setIsMutating(false);
      }
    },
    [refreshAppointmentsData],
  );

  const scheduledAppointmentsCount = useMemo(
    () =>
      appointments.filter((appointment) => appointment.status === "SCHEDULED")
        .length,
    [appointments],
  );

  return {
    appointments,
    veterinarianOptions,
    appointmentTypeOptions,
    clientOptions,
    petOptions,
    speciesOptions,
    breedOptions,
    isLoading,
    isMutating,
    scheduledAppointmentsCount,
    loadAppointments,
    handleCreateAppointment,
    handleUpdateAppointment,
    handleCancelAppointment,
  };
}