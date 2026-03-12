import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { CountrySelect } from '@/modules/countries/components/country-select';
import { Input } from '@/shared/ui/input';
import { Sms, Call, Hashtag, Home, Building, Global as GlobalIcon } from 'iconsax-react';

export function Step5SmsConfig() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Ces champs sont optionnels et peuvent être complétés plus tard</p>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="emailEnterprise"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Email entreprise</FormLabel>
              <FormControl>
                <div className="relative">
                  <Sms size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" placeholder="contact@entreprise.com" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="telephoneEntreprise"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Tél. entreprise</FormLabel>
              <FormControl>
                <div className="relative">
                  <Call size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Numéro entreprise" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="numeroCommerce"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">Numéro de commerce</FormLabel>
            <FormControl>
              <div className="relative">
                <Hashtag size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Numéro de registre de commerce" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="adresseEnterprise"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Adresse entreprise</FormLabel>
              <FormControl>
                <div className="relative">
                  <Home size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Adresse de l'entreprise" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="villeEntreprise"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Ville entreprise</FormLabel>
              <FormControl>
                <div className="relative">
                  <Building size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Ville de l'entreprise" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="urlSiteweb"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">Site web</FormLabel>
            <FormControl>
              <div className="relative">
                <GlobalIcon size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="https://www.entreprise.com" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="enterpriseCountryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">Pays de l&apos;entreprise</FormLabel>
            <FormControl>
              <CountrySelect {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
