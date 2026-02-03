"use client";

import { cn } from "@/core/lib/utils";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import DOMPurify from "dompurify";

interface ConfirmDialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  onDismiss?: (state: boolean) => void;
  onAction?: () => void;
  className?: string;
  messages: {
    title: string;
    description?: string;
    buttons?: {
      cancel?: string;
      action?: string;
    };
  };
}

// Sanitize HTML to prevent XSS attacks
function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: strip all HTML tags for safety
    return html.replace(/<[^>]*>/g, '');
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'span'],
    ALLOWED_ATTR: ['class'],
  });
}

export function ConfirmDialog({ isOpen, isLoading, onDismiss, onAction, messages, className }: ConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={isLoading ? undefined : onDismiss}>
      <AlertDialogContent className={cn("sm:max-w-md", className)} aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(messages.title),
            }}
          />
          {messages.description && (
            <AlertDialogDescription
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(messages.description),
              }}
            />
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
              {messages.buttons?.cancel || "Non, annuler"}
            </Button>
          )}

          {onAction && (
            <Button onClick={onAction} isLoading={isLoading}>
              {messages.buttons?.action || "Oui, continuer"}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
