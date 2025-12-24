import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { CountrySelect } from '@/modules/countries/components/country-select';
import { Input } from '@/shared/ui/input';
import { MessageText, Hashtag, Home, Building, Global } from 'iconsax-react';

export function Step3SmsConfig() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="smsESenderId"
        render={({ field }) => (
          <FormItem>
                        <FormLabel className="text-gray-300">ID de l'expéditeur SMS</FormLabel>
            <FormControl>
              <div className="relative">
                <MessageText size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Max 11 characters" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="numeroCommerce"
        render={({ field }) => (
          <FormItem>
                        <FormLabel className="text-gray-300">Numéro de commerce</FormLabel>
            <FormControl>
              <div className="relative">
                <Hashtag size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Enter your trade number" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="adresseEnterprise"
        render={({ field }) => (
          <FormItem>
                        <FormLabel className="text-gray-300">Adresse de l'entreprise</FormLabel>
            <FormControl>
              <div className="relative">
                <Home size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Enter your company address" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
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
                        <FormLabel className="text-gray-300">Ville de l'entreprise</FormLabel>
            <FormControl>
              <div className="relative">
                <Building size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Enter your company city" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
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
            <FormLabel className="text-gray-300">Pays de l'entreprise</FormLabel>
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
