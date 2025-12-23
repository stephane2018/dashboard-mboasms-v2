import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

export function Step2Enterprise() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="socialRaison"
        render={({ field }) => (
          <FormItem>
                        <FormLabel className="text-gray-300">Company Name</FormLabel>
            <FormControl>
                            <Input className="bg-gray-800 border-gray-600 text-white" placeholder="Enter your company name" {...field} />
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
                        <FormLabel className="text-gray-300">Activity Domain</FormLabel>
            <FormControl>
                            <Input className="bg-gray-800 border-gray-600 text-white" placeholder="e.g., Technology, Finance" {...field} />
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
                        <FormLabel className="text-gray-300">Taxpayer Number</FormLabel>
            <FormControl>
                            <Input className="bg-gray-800 border-gray-600 text-white" placeholder="Enter your taxpayer number" {...field} />
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
                        <FormLabel className="text-gray-300">Company Email</FormLabel>
            <FormControl>
                            <Input type="email" className="bg-gray-800 border-gray-600 text-white" placeholder="contact@company.com" {...field} />
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
                        <FormLabel className="text-gray-300">Company Phone</FormLabel>
            <FormControl>
                            <Input className="bg-gray-800 border-gray-600 text-white" placeholder="Enter company phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
