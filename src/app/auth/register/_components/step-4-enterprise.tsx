import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Building, Category, Receipt, MessageText } from 'iconsax-react';

export function Step4Enterprise() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Les champs marqués d&apos;un <span className="text-red-500">*</span> sont obligatoires</p>

      <FormField
        control={control}
        name="socialRaison"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">Raison sociale</FormLabel>
            <FormControl>
              <div className="relative">
                <Building size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Nom de l'entreprise" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
            <FormLabel className="text-foreground">Domaine d&apos;activité <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <div className="relative">
                <Category size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Ex: Technologie, Finance..." {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
            <FormLabel className="text-foreground">Numéro de contribuable <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <div className="relative">
                <Receipt size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Numéro de contribuable" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
            <FormLabel className="text-foreground">ID expéditeur SMS <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <div className="relative">
                <MessageText size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Max 11 caractères" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
