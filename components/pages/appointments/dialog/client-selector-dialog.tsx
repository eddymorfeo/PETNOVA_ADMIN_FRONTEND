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

import type { ClientItem } from "@/types/clients/client.type";

type ClientSelectorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: ClientItem[];
  onSelectClient: (client: ClientItem) => void;
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

export function ClientSelectorDialog({
  open,
  onOpenChange,
  clients,
  onSelectClient,
}: ClientSelectorDialogProps) {
  const [query, setQuery] = useState("");

  const filteredClients = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return clients.filter((client) => client.is_active);
    }

    return clients.filter((client) => {
      const fullName = normalizeText(client.full_name);
      const email = normalizeText(client.email);
      const documentId = normalizeText(client.document_id ?? "");
      return (
        client.is_active &&
        (fullName.includes(normalizedQuery) ||
          email.includes(normalizedQuery) ||
          documentId.includes(normalizedQuery))
      );
    });
  }, [clients, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[920px]">
        <DialogHeader>
          <DialogTitle>Buscar cliente</DialogTitle>
          <DialogDescription>
            Selecciona el cliente al que pertenece la cita.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, email o documento..."
            className="pl-10"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="max-h-[420px] overflow-auto">
            <Table>
              <TableHeader className="bg-slate-50/70">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[120px] text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
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
                      <TableCell>{client.document_id ?? "Sin documento"}</TableCell>
                      <TableCell>{client.email}</TableCell>
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