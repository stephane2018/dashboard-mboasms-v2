"use client"

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Lock, Eye, EyeSlash, Location, Home2 } from 'iconsax-react';
import { CountrySelect } from '@/shared/common/country-select';
import { useT } from '@/core/hooks';

export function Step3Security() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { control, setValue } = useFormContext();
  const { t } = useT();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">{t('auth.password')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...field}
                  className="pl-10 pr-10 h-11 rounded-xl bg-background border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeSlash size={20} variant="Bulk" color="currentColor" className="text-primary" />
                  ) : (
                    <Eye size={20} variant="Bulk" color="currentColor" className="text-primary" />
                  )}
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
            <FormLabel className="text-foreground">{t('auth.confirmPassword')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...field}
                  className="pl-10 pr-10 h-11 rounded-xl bg-background border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeSlash size={20} variant="Bulk" color="currentColor" className="text-primary" />
                  ) : (
                    <Eye size={20} variant="Bulk" color="currentColor" className="text-primary" />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="pt-2">
        <p className="text-sm font-medium text-foreground mb-3">{t('auth.locationSection')}</p>
        <div className="space-y-4">
          <FormField
            control={control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">{t('common.country')}</FormLabel>
                <FormControl>
                  <CountrySelect
                    value={field.value}
                    onSelect={(country) => {
                      field.onChange(country.nom);
                      setValue('enterpriseCountryId', country.id);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">{t('common.city')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Location size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder={t('auth.cityPlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">{t('common.address')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Home2 size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder={t('auth.addressPlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
