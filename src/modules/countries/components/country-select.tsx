'use client';

import React, { useState, useMemo } from 'react';
import { useCountries } from '../hooks/useCountries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Skeleton } from '@/shared/ui/skeleton';
import { Input } from '@/shared/ui/input';
import { SearchNormal1 as Search } from 'iconsax-react';

interface CountrySelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  const { data: countries, isLoading, isError } = useCountries();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = useMemo(() => {
    if (!countries) return [];
    if (!searchTerm) return countries;
    
    return countries.filter(country =>
      country.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

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
      <SelectContent className="max-h-[300px]">
        <div className="sticky top-0 z-10 bg-background p-2 border-b">
          <div className="relative">
            <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div className="max-h-[240px] overflow-y-auto">
          {filteredCountries.length > 0 ? (
            filteredCountries.map(country => (
              <SelectItem key={country.id} value={country.code}>
                {country.nom}
              </SelectItem>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Aucun pays trouvé
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
