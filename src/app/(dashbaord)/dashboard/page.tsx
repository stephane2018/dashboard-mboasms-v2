"use client";

import { Button } from "@/shared/ui/button";
import {
  ArrowRight2,
  Chart,
  MessageText1,
  People,
  Send2,
  WalletAdd,
  Profile2User,
  WalletMoney,
} from "iconsax-react";
import { SmsTransactionChart } from "@/modules/sms/components/sms-transaction-chart";
import { GlobalSmsCard } from "./components/global-sms-card";
import { BalanceRechargeChart } from "./components/balance-recharge-chart";
import { Skeleton } from "@/shared/ui/skeleton";
import type { MainStatistics } from "@/modules/statistics/types";
import { useMainStatistics } from "@/core/hooks";
import { useT } from "@/core/hooks";

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('fr-FR').format(num) + ' FCFA';
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 border-l-4 border-l-muted">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

function GlobalSkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/50 bg-linear-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10 p-5 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-28 mb-2" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
}

export default function DashboardHome() {
  const { statistics, isLoading } = useMainStatistics();
  const { t } = useT();

  // Logs de debug pour diagnostiquer les problèmes en prod
  if (typeof window !== 'undefined') {
    console.log('[DASHBOARD] Rendu', {
      hasStatistics: !!statistics,
      isLoading,
      hasCookie: document.cookie.includes('mboasms-access-token'),
    })
  }

  const kpiCards = [
    {
      label: t('dashboard.groups'),
      value: statistics ? formatNumber(statistics.groupCount) : "0",
      trend: t('dashboard.totalGroups'),
      icon: MessageText1,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10",
      border: "border-l-violet-500",
    },
    {
      label: t('dashboard.recharges'),
      value: statistics ? formatNumber(statistics.rechargeCount) : "0",
      trend: t('dashboard.rechargeCount'),
      icon: Chart,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-l-emerald-500",
    },
    {
      label: t('dashboard.availableCredit'),
      value: statistics ? formatCurrency(statistics.smsCredit) : "0 FCFA",
      trend: t('dashboard.rechargeRecommended'),
      icon: WalletMoney,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-l-amber-500",
    },
    {
      label: t('common.phone') === 'Phone' ? 'Contacts' : 'Contacts',
      value: statistics ? formatNumber(statistics.contactCount) : "0",
      trend: t('dashboard.totalContacts'),
      icon: People,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-500/10",
      border: "border-l-sky-500",
    },
  ];

  const quickActions = [
    {
      title: t('dashboard.sendCampaign'),
      description: t('dashboard.sendCampaignDesc'),
      href: "/sms",
      icon: Send2,
      color: "text-primary",
      bg: "bg-primary/5 hover:bg-primary/10",
    },
    {
      title: t('dashboard.rechargeBalance'),
      description: t('dashboard.rechargeBalanceDesc'),
      href: "/recharge",
      icon: WalletAdd,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10",
    },
    {
      title: t('dashboard.manageContacts'),
      description: t('dashboard.manageContactsDesc'),
      href: "/contacts",
      icon: Profile2User,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/5 dark:hover:bg-sky-500/10",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('dashboard.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <Button asChild size="sm" className="rounded-xl px-5 gap-2 shadow-sm">
          <a href="/sms">
            {t('dashboard.newCampaign')}
            <ArrowRight2 size="16" variant="Bulk" color="currentColor" />
          </a>
        </Button>
      </section>

      {/* KPI Cards */}
      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <GlobalSkeletonCard />
          </>
        ) : (
          <>
            {kpiCards.map((kpi) => (
              <div
                key={kpi.label}
                className={`rounded-2xl border border-border/50 bg-card p-5 border-l-4 ${kpi.border} transition-shadow hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {kpi.label}
                  </span>
                  <div className={`rounded-xl ${kpi.bg} p-2`}>
                    <kpi.icon size="18" color="currentColor" variant="Bulk" className={kpi.color} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground leading-tight">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.trend}</p>
              </div>
            ))}
            <GlobalSmsCard
              label={t('dashboard.smsSentGlobal')}
              value={statistics ? formatNumber(statistics.smsSentCount) : "0"}
              trend={t('dashboard.totalSmsSent')}
            />
          </>
        )}
      </section>

      {/* Charts + Quick Actions */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card">
          <div className="p-5 pb-0">
            <h2 className="text-base font-semibold text-foreground">{t('dashboard.smsPerformance')}</h2>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.smsVolumeByPeriod')}
            </p>
          </div>
          <div className="p-5 pt-3">
            <SmsTransactionChart />
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <h2 className="text-base font-semibold text-foreground mb-1">{t('dashboard.quickActions')}</h2>
          <p className="text-xs text-muted-foreground mb-4">
            {t('dashboard.quickActionsDesc')}
          </p>
          <div className="space-y-2.5">
            {quickActions.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className={`flex items-center gap-3.5 rounded-xl ${action.bg} p-3.5 transition-all duration-200 group`}
              >
                <div className="shrink-0 rounded-lg bg-background p-2 shadow-sm border border-border/50">
                  <action.icon size="18" color="currentColor" variant="Bulk" className={action.color} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-foreground">{action.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
                </div>
                <ArrowRight2 size="14" color="currentColor" className="text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Balance Recharge Chart */}
      <section>
        <div className="rounded-2xl border border-border/50 bg-card">
          <div className="p-5 pb-0">
            <h2 className="text-base font-semibold text-foreground">{t('dashboard.balanceRecharges')}</h2>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.balanceRechargesDesc')}
            </p>
          </div>
          <div className="p-5 pt-3">
            <BalanceRechargeChart />
          </div>
        </div>
      </section>
    </div>
  );
}
