import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

export function Step3SmsConfig() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="smsESenderId"
        render={({ field }) => (
          <FormItem>
                        <FormLabel className="text-gray-300">SMS Sender ID</FormLabel>
            <FormControl>
                            <Input className="bg-gray-800 border-gray-600 text-white" placeholder="Max 11 characters" {...field} />
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
                        <FormLabel className="text-gray-300">Trade Number</FormLabel>
            <FormControl>
                            <Input className="bg-gray-800 border-gray-600 text-white" placeholder="Enter your trade number" {...field} />
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
                        <FormLabel className="text-gray-300">Company Address</FormLabel>
            <FormControl>
                            <Input className="bg-gray-800 border-gray-600 text-white" placeholder="Enter your company address" {...field} />
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
                        <FormLabel className="text-gray-300">Company City</FormLabel>
            <FormControl>
                            <Input className="bg-gray-800 border-gray-600 text-white" placeholder="Enter your company city" {...field} />
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
                        <FormLabel className="text-gray-300">Company Country</FormLabel>
            <FormControl>
                            <Input className="bg-gray-800 border-gray-600 text-white" placeholder="Enter your company country" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
