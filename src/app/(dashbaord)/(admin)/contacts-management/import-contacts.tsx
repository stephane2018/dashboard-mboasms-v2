"use client"

import { useState } from 'react';
import { useImportContacts } from "@/core/hooks/useContact";
import { useEnterprises } from "@/core/hooks/useEnterprise";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/shared/ui/dialog";

export function ImportContacts() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("");
  const { data: enterprises } = useEnterprises();
  const { mutate: importContacts, isPending } = useImportContacts();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = () => {
    if (file && selectedEnterpriseId) {
      importContacts({ file, enterpriseId: selectedEnterpriseId }, {
      onSuccess: () => {
        setIsOpen(false);
        setFile(null);
      }
    });
    }
  };

    return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Import Contacts</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import new contacts for an enterprise.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="enterprise" className="text-right">Enterprise</Label>
            <Select value={selectedEnterpriseId} onValueChange={setSelectedEnterpriseId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an enterprise" />
              </SelectTrigger>
              <SelectContent>
                {enterprises?.map((enterprise) => (
                  <SelectItem key={enterprise.id} value={enterprise.id}>
                    {enterprise.socialRaison}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contacts-file" className="text-right">File</Label>
            <Input id="contacts-file" type="file" onChange={handleFileChange} accept=".csv" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleImport} disabled={!file || !selectedEnterpriseId || isPending}>
            {isPending ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
