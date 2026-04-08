"use client"

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Building, Category, Receipt, MessageText } from 'iconsax-react';
import { useT } from '@/core/hooks';

export function Step4Enterprise() {
  const { control } = useFormContext();
  const { t } = useT();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t('auth.requiredFieldsNote')}</p>

      <FormField
        control={control}
        name="socialRaison"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">{t('auth.socialRaison')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Building size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder={t('auth.socialRaisonPlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
            <FormLabel className="text-foreground">{t('auth.activityDomain')} <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <div className="relative">
                <Category size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder={t('auth.activityDomainPlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
            <FormLabel className="text-foreground">{t('auth.contribuableNumber')} <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <div className="relative">
                <Receipt size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder={t('auth.contribuableNumberPlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="smsESenderId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">{t('auth.smsSenderId')} <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <div className="relative">
                <MessageText size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder={t('auth.smsSenderIdPlaceholder')} {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
