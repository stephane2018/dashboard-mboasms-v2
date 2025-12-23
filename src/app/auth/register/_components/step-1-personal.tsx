import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { AccountTypeCard } from './account-type-card';
import { User, Building } from 'iconsax-react';

export function Step1Personal() {
  const { control, watch } = useFormContext();
  const accountType = watch('accountType');

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="accountType"
        render={({ field }) => (
          <FormItem className="space-y-2">
                          <FormLabel className="text-gray-300">Account Type</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-4">
                <AccountTypeCard
                  value="personal"
                  label="Personal"
                  icon={<User size="32" />}
                  isSelected={field.value === 'personal'}
                  onClick={() => field.onChange('personal')}
                />
                <AccountTypeCard
                  value="business"
                  label="Business"
                  icon={<Building size="32" />}
                  isSelected={field.value === 'business'}
                  onClick={() => field.onChange('business')}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
                            <FormLabel className="text-gray-300">First Name</FormLabel>
              <FormControl>
                                <Input className="bg-gray-800 border-gray-600 text-white" placeholder="Enter your first name" {...field} />
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
                            <FormLabel className="text-gray-300">Last Name</FormLabel>
              <FormControl>
                                <Input className="bg-gray-800 border-gray-600 text-white" placeholder="Enter your last name" {...field} />
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
                          <FormLabel className="text-gray-300">Email</FormLabel>
            <FormControl>
                            <Input type="email" className="bg-gray-800 border-gray-600 text-white" placeholder="email@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
                          <FormLabel className="text-gray-300">Phone Number</FormLabel>
            <FormControl>
                              <Input className="bg-gray-800 border-gray-600 text-white" placeholder="Enter your phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
                          <FormLabel className="text-gray-300">Password</FormLabel>
            <FormControl>
                            <Input type="password" className="bg-gray-800 border-gray-600 text-white" placeholder="••••••••" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
