"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { PetItem } from "@/types/pets/pet.type";

type PetSelectorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pets: PetItem[];
  selectedClientId?: string;
  onSelectPet: (pet: PetItem) => void;
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

export function PetSelectorDialog({
  open,
  onOpenChange,
  pets,
  selectedClientId,
  onSelectPet,
}: PetSelectorDialogProps) {
  const [query, setQuery] = useState("");

  const filteredPets = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    const petsByClient = selectedClientId
      ? pets.filter((pet) => pet.client_id === selectedClientId)
      : pets;

    if (!normalizedQuery) {
      return petsByClient.filter((pet) => pet.is_active);
    }

    return petsByClient.filter((pet) => {
      const name = normalizeText(pet.name);
      const species = normalizeText(pet.species?.name ?? "");
      const breed = normalizeText(pet.breed?.name ?? "");

      return (
        pet.is_active &&
        (name.includes(normalizedQuery) ||
          species.includes(normalizedQuery) ||
          breed.includes(normalizedQuery))
      );
    });
  }, [pets, query, selectedClientId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[920px]">
        <DialogHeader>
          <DialogTitle>Buscar mascota</DialogTitle>
          <DialogDescription>
            Selecciona la mascota asociada a la cita.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, especie o raza..."
            className="pl-10"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="max-h-[420px] overflow-auto">
            <Table>
              <TableHeader className="bg-slate-50/70">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Mascota</TableHead>
                  <TableHead>Especie</TableHead>
                  <TableHead>Raza</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Acción
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-slate-500"
                    >
                      No hay mascotas para mostrar.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPets.map((pet) => (
                    <TableRow key={pet.id} className="border-slate-200">
                      <TableCell className="font-medium text-slate-900">
                        {pet.name}
                      </TableCell>
                      <TableCell>{pet.species?.name ?? "-"}</TableCell>
                      <TableCell>{pet.breed?.name ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            onSelectPet(pet);
                            onOpenChange(false);
                          }}
                        >
                          Seleccionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}