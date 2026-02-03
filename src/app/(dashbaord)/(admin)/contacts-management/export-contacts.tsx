"use client"

import { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
        allContacts = [...allContacts, ...(data as { content: EnterpriseContactResponseType[] }).content];
      }

      const contactsData = allContacts.map(contact => ({
        FirstName: contact.firstname,
        LastName: contact.lastname,
        Email: contact.email,
        PhoneNumber: contact.phoneNumber,
        Enterprise: contact.enterprise?.socialRaison || 'N/A',
        Country: contact.country,
        Archived: contact.archived ? 'Yes' : 'No',
      }));

      if (fileType === 'xlsx') {
        // Use exceljs for secure Excel export
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'MboaSMS';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet('Contacts');

        // Add headers
        const headers = ['FirstName', 'LastName', 'Email', 'PhoneNumber', 'Enterprise', 'Country', 'Archived'];
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true };
        headerRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
          };
        });

        // Add data rows
        contactsData.forEach(contact => {
          worksheet.addRow([
            contact.FirstName,
            contact.LastName,
            contact.Email,
            contact.PhoneNumber,
            contact.Enterprise,
            contact.Country,
            contact.Archived,
          ]);
        });

        // Auto-fit columns
        worksheet.columns.forEach(column => {
          column.width = 15;
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, 'contacts.xlsx');
      } else {
        // CSV export
        const headers = ['FirstName', 'LastName', 'Email', 'PhoneNumber', 'Enterprise', 'Country', 'Archived'];
        const csvContent = [
          headers.join(','),
          ...contactsData.map(contact =>
            [
              contact.FirstName,
              contact.LastName,
              contact.Email,
              contact.PhoneNumber,
              contact.Enterprise,
              contact.Country,
              contact.Archived,
            ].map(value => `"${String(value || '').replace(/"/g, '""')}"`).join(',')
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'contacts.csv');
      }

      toast.success('Contacts exported successfully!');
      setIsOpen(false);
    } catch {
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
