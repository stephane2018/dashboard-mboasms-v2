"use client"

import { useMemo } from 'react';
import { useAllContacts } from "@/core/hooks/useContact";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { People, TickCircle, CloseCircle, Call, Chart, Simcard } from 'iconsax-react';

const operatorPrefixes: { [key: string]: string[] } = {
  MTN: ["67", "650", "651", "652", "653", "654"],
  Orange: ["69", "655", "656", "657", "658", "659"],
  Nexttel: ["66"],
  Camtel: ["2", "62"],
};

const getOperator = (phoneNumber: string) => {
  for (const operator in operatorPrefixes) {
    if (operatorPrefixes[operator].some(prefix => phoneNumber.startsWith(prefix))) {
      return operator;
    }
  }
  return "Unknown";
};

export function ContactStats() {
  const { data: contacts, isLoading } = useAllContacts();

  const stats = useMemo(() => {
    if (!contacts) return { total: 0, valid: 0, invalid: 0, byOperator: {} };

    const byOperator: { [key: string]: number } = {};
    let valid = 0;
    let invalid = 0;

    contacts.forEach(contact => {
      if (contact.phoneNumber) {
        valid++;
        const operator = getOperator(contact.phoneNumber);
        byOperator[operator] = (byOperator[operator] || 0) + 1;
      } else {
        invalid++;
      }
    });

    return { total: contacts.length, valid, invalid, byOperator };
  }, [contacts]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
                <div className="flex items-center gap-2">
          <Chart size="20" variant="Bulk" color="currentColor" className="text-primary" />
          <h2 className="text-lg font-medium">Contacts Stats</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <People className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valid Contacts</CardTitle>
              <TickCircle className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.valid}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invalid Contacts</CardTitle>
              <CloseCircle className="h-4 w-4 text-destructive" variant="Bulk" color="currentColor" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.invalid}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
                <div className="flex items-center gap-2">
          <Simcard size="20" variant="Bulk" color="currentColor" className="text-primary" />
          <h2 className="text-lg font-medium">Operator Stats</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-2">
          {Object.entries(stats.byOperator).map(([operator, count]) => (
            <Card key={operator}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{operator}</CardTitle>
                <Call className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
