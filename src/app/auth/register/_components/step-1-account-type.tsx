import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { AccountTypeCard } from './account-type-card';
import { User, Building } from 'iconsax-react';

export function Step1AccountType() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="accountType"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-gray-300 text-lg">Choisissez votre type de compte</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-6 py-3">
                <AccountTypeCard
                  value="personal"
                  label="Personnel"
                  icon={<User size="32" variant="Bulk" color="currentColor" className="text-primary" />}
                  isSelected={field.value === 'personal'}
                  onClick={() => field.onChange('personal')}
                />
                <AccountTypeCard
                  value="business"
                  label="Entreprise"
                  icon={<Building size="32" variant="Bulk" color="currentColor" className="text-primary" />}
                  isSelected={field.value === 'business'}
                  onClick={() => field.onChange('business')}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
