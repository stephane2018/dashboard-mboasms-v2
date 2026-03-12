import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { User, Sms } from 'iconsax-react';

export function Step2Personal() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Prénom</FormLabel>
              <FormControl>
                <div className="relative">
                  <User size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Entrez votre prénom" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Nom de famille</FormLabel>
              <FormControl>
                <div className="relative">
                  <User size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Entrez votre nom" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">Email</FormLabel>
            <FormControl>
              <div className="relative">
                <Sms size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="email@example.com" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
