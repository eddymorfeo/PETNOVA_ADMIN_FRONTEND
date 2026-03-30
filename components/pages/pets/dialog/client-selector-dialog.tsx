"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { PetClientOption } from "@/types/pets/pet.type";
import { useClientSearch } from "@/hooks/pets/use-client-search";

type ClientSelectorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectClient: (client: PetClientOption) => void;
};

export function ClientSelectorDialog({
  open,
  onOpenChange,
  onSelectClient,
}: ClientSelectorDialogProps) {
  const [query, setQuery] = useState("");
  const { clients, isSearching, handleSearch } = useClientSearch();

  const handleSubmitSearch = async () => {
    await handleSearch(query);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>Buscar cliente</DialogTitle>
          <DialogDescription>
            Busca por nombre o documento y selecciona el cliente al que pertenece la mascota.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o documento..."
              className="pl-10"
            />
          </div>

          <Button type="button" onClick={handleSubmitSearch}>
            Buscar
          </Button>
        </div>

        <div className="max-h-[360px] overflow-auto rounded-2xl border border-slate-200">
          {isSearching ? (
            <div className="p-6 text-sm text-slate-500">Buscando clientes...</div>
          ) : clients.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No hay resultados para mostrar.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-medium text-slate-900">{client.full_name}</p>
                    <p className="text-sm text-slate-500">
                      {client.document_id ?? "Sin documento"} · {client.email}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      onSelectClient(client);
                      onOpenChange(false);
                    }}
                  >
                    Seleccionar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}