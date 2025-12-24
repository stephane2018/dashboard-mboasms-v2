'use client';

import React from 'react';
import { useCountries } from '../hooks/useCountries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Skeleton } from '@/shared/ui/skeleton';

interface CountrySelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  const { data: countries, isLoading, isError } = useCountries();

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (isError) {
    return <div className="text-red-500">Erreur de chargement des pays.</div>;
  }

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionnez un pays" />
      </SelectTrigger>
      <SelectContent>
        {countries?.map(country => (
          <SelectItem key={country.id} value={country.code}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
