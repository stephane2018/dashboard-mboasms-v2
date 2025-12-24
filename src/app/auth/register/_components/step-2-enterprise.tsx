import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Building, Category, Receipt, Sms, Call } from 'iconsax-react';

export function Step2Enterprise() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="socialRaison"
        render={({ field }) => (
          <FormItem>
                        <FormLabel className="text-gray-300">Nom de l'entreprise</FormLabel>
            <FormControl>
              <div className="relative">
                <Building size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Enter your company name" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="activityDomain"
        render={({ field }) => (
          <FormItem>
                        <FormLabel className="text-gray-300">Domaine d'activité</FormLabel>
            <FormControl>
              <div className="relative">
                <Category size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="e.g., Technology, Finance" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="contribuableNumber"
        render={({ field }) => (
          <FormItem>
                        <FormLabel className="text-gray-300">Numéro de contribuable</FormLabel>
            <FormControl>
              <div className="relative">
                <Receipt size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Enter your taxpayer number" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="emailEnterprise"
        render={({ field }) => (
          <FormItem>
                        <FormLabel className="text-gray-300">Email de l'entreprise</FormLabel>
            <FormControl>
              <div className="relative">
                <Sms size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input type="email" placeholder="contact@company.com" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
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
                        <FormLabel className="text-gray-300">Téléphone de l'entreprise</FormLabel>
            <FormControl>
              <div className="relative">
                <Call size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Enter company phone number" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
