"use client"

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { getPaginatedAllContacts } from '@/core/services/contact.service';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { toast } from 'sonner';
import type { EnterpriseContactResponseType } from '@/core/models/contact-new';

export function ExportContacts() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(100);
  const [numPages, setNumPages] = useState(1);
  const [fileType, setFileType] = useState<'xlsx' | 'csv'>('xlsx');

  const handleExport = async () => {
    setIsLoading(true);
    try {
      let allContacts: EnterpriseContactResponseType[] = [];
      for (let i = 0; i < numPages; i++) {
        const data = await getPaginatedAllContacts(i, pageSize);
        allContacts = [...allContacts, ...data.content];
      }

      const worksheet = XLSX.utils.json_to_sheet(allContacts.map(contact => ({
        FirstName: contact.firstname,
        LastName: contact.lastname,
        Email: contact.email,
        PhoneNumber: contact.phoneNumber,
        Enterprise: contact.enterprise?.socialRaison || 'N/A',
        Country: contact.country,
        Archived: contact.archived ? 'Yes' : 'No',
      })));

      if (fileType === 'xlsx') {
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
        XLSX.writeFile(workbook, 'contacts.xlsx');
      } else {
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'contacts.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success('Contacts exported successfully!');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to export contacts.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Export</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Contacts</DialogTitle>
          <DialogDescription>
            Select the number of pages and file format for the export.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="page-size" className="text-right">Page Size</Label>
            <Input
              id="page-size"
              type="number"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="num-pages" className="text-right">Pages</Label>
            <Input
              id="num-pages"
              type="number"
              value={numPages}
              onChange={(e) => setNumPages(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-type" className="text-right">Format</Label>
            <Select value={fileType} onValueChange={(value: 'xlsx' | 'csv') => setFileType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
