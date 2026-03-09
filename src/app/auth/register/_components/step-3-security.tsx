import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Call, Lock, Eye, EyeSlash } from 'iconsax-react';

export function Step3Security() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">Numéro de téléphone</FormLabel>
            <FormControl>
              <div className="relative">
                <Call size={20} variant="Bulk" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Entrez votre numéro de téléphone" {...field} className="pl-10 h-11 rounded-xl bg-background border-border" />
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
            <FormLabel className="text-foreground">Mot de passe</FormLabel>
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
            <FormLabel className="text-foreground">Confirmer le mot de passe</FormLabel>
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
    </div>
  );
}
