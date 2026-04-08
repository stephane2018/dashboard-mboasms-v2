"use client";

import { useT } from "@/core/hooks";
import { cn } from "@/core/lib/utils";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  onDismiss?: (state: boolean) => void;
  onAction?: () => void;
  className?: string;
  messages: {
    title: React.ReactNode;
    description?: React.ReactNode;
    buttons?: {
      cancel?: string;
      action?: string;
    };
  };
}

export function ConfirmDialog({ isOpen, isLoading, onDismiss, onAction, messages, className }: ConfirmDialogProps) {
  const { t } = useT();
  return (
    <AlertDialog open={isOpen} onOpenChange={isLoading ? undefined : onDismiss}>
      <AlertDialogContent className={cn("sm:max-w-md", className)} aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>{messages.title}</AlertDialogTitle>
          {messages.description && (
            <AlertDialogDescription>{messages.description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          {onDismiss && (
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={() => {
                onDismiss(false);
              }}
            >
              {messages.buttons?.cancel || t('common.noCancel')}
            </Button>
          )}

          {onAction && (
            <Button onClick={onAction} isLoading={isLoading}>
              {messages.buttons?.action || t('common.yesContinue')}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
