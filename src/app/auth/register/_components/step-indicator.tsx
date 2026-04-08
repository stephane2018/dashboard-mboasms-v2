"use client"

import React from 'react';
import { useT } from '@/core/hooks';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepNames }: StepIndicatorProps) {
  const { t } = useT();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-foreground">{stepNames[currentStep]}</p>
        <p className="text-sm text-muted-foreground">
          {t('auth.stepOf', { current: currentStep + 1, total: totalSteps })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              index <= currentStep ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
