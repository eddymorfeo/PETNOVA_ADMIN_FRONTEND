"use client";

import { useEffect } from "react";
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
  const {
    filteredClients,
    query,
    setQuery,
    isLoading,
    hasLoaded,
    loadClients,
  } = useClientSearch();

  useEffect(() => {
    if (!open || hasLoaded) {
      return;
    }

    void loadClients();
  }, [hasLoaded, loadClients, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[920px]">
        <DialogHeader>
          <DialogTitle>Buscar cliente</DialogTitle>
          <DialogDescription>
            Busca por nombre, documento o email y selecciona el cliente al que
            pertenece la mascota.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, documento o email..."
            className="pl-10"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="max-h-[420px] overflow-auto">
            <Table>
              <TableHeader className="bg-slate-50/70">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Nombre completo</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Acción
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-slate-500"
                    >
                      Cargando clientes...
                    </TableCell>
                  </TableRow>
                ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-slate-500"
                    >
                      No hay clientes para mostrar.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="border-slate-200">
                      <TableCell className="font-medium text-slate-900">
                        {client.full_name}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {client.document_id ?? "Sin documento"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {client.email}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {client.phone ?? "-"}
                      </TableCell>
                      <TableCell className="text-right">
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