"use client";

import { ApiDocsLayout } from '@/shared/landing_components/components/api-docs/ApiDocsLayout';
import { ApiOverview } from '@/shared/landing_components/components/api-docs/ApiOverview';
import Header from '@/shared/landing_components/components/layout/Header';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <ApiDocsLayout>
          <ApiOverview />
        </ApiDocsLayout>
      </div>
    </div>
  );
}
