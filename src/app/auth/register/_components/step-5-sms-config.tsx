"use client"

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { CountrySelect } from '@/modules/countries/components/country-select';
import { Input } from '@/shared/ui/input';
import { Sms, Call, Hashtag, Home, Building, Global as GlobalIcon } from 'iconsax-react';
import { useT } from '@/core/hooks';

export function Step5SmsConfig() {
  const { control } = useFormContext();
  const { t } = useT();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t('auth.optionalFieldsNote')}</p>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="emailEnterprise"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">{t('auth.emailEnterprise')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Sms size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" placeholder={t('auth.emailEnterprisePlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
              <FormLabel className="text-foreground">{t('auth.telephoneEntreprise')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Call size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder={t('auth.telephoneEntreprisePlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
            <FormLabel className="text-foreground">{t('auth.numeroCommerce')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Hashtag size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder={t('auth.numeroCommercePlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
              <FormLabel className="text-foreground">{t('auth.adresseEnterprise')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Home size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder={t('auth.adresseEnterprisePlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
              <FormLabel className="text-foreground">{t('auth.villeEntreprise')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Building size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder={t('auth.villeEntreprisePlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
            <FormLabel className="text-foreground">{t('auth.website')}</FormLabel>
            <FormControl>
              <div className="relative">
                <GlobalIcon size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder={t('auth.websitePlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
            <FormLabel className="text-foreground">{t('auth.enterpriseCountry')}</FormLabel>
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
