import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { AccountTypeCard } from './account-type-card';
import { User, Building, Sms, Call, Lock, Eye, EyeSlash } from 'iconsax-react';

export function Step1Personal() {
  const [showPassword, setShowPassword] = useState(false);
  const { control, watch } = useFormContext();
  const accountType = watch('accountType');

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="accountType"
        render={({ field }) => (
          <FormItem className="space-y-2">
                                        <FormLabel className="text-gray-300">Type de compte</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-4">
                <AccountTypeCard
                  value="personal"
                  label="Personal"
                  icon={<User size="32" variant="Bulk" color="currentColor" className="text-primary" />}
                  isSelected={field.value === 'personal'}
                  onClick={() => field.onChange('personal')}
                />
                <AccountTypeCard
                  value="business"
                  label="Business"
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
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
                            <FormLabel className="text-gray-300">Prénom</FormLabel>
              <FormControl>
                <div className="relative">
                  <User size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Enter your first name" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
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
                            <FormLabel className="text-gray-300">Nom de famille</FormLabel>
              <FormControl>
                <div className="relative">
                  <User size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Enter your last name" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
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
                        <FormLabel className="text-gray-300">Email</FormLabel>
            <FormControl>
              <div className="relative">
                <Sms size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input type="email" placeholder="email@example.com" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
              </div>
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
                        <FormLabel className="text-gray-300">Numéro de téléphone</FormLabel>
            <FormControl>
              <div className="relative">
                <Call size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Enter your phone number" {...field} className="pl-10 bg-gray-800 border-gray-600 text-white" />
              </div>
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
                        <FormLabel className="text-gray-300">Mot de passe</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeSlash size={20} variant="Bulk" color="currentColor" className='text-primary' /> : <Eye size={20} variant="Bulk" color="currentColor" className='text-primary' />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300">Confirmer le mot de passe</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock size={20} variant="Bulk" color="currentColor" className="text-primary absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeSlash size={20} variant="Bulk" color="currentColor" className='text-primary' /> : <Eye size={20} variant="Bulk" color="currentColor" className='text-primary' />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
