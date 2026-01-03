"use client";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  ArrowRight2,
  Chart,
  MessageText1,
  People,
  WalletMoney,
} from "iconsax-react";
import { SmsTransactionChart } from "@/modules/sms/components/sms-transaction-chart";
import { GlobalSmsCard } from "./components/global-sms-card";
import { BalanceRechargeChart } from "./components/balance-recharge-chart";
import { Skeleton } from "@/shared/ui/skeleton";
import { useMainStatistics } from "@/modules/statistics/hooks";
import type { MainStatistics } from "@/modules/statistics/types";

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('fr-FR').format(num) + ' FCFA';
};

const getKpiCards = (statistics: MainStatistics | null) => [
  {
    label: "Groupes",
    value: statistics ? formatNumber(statistics.groupCount) : "0",
    trend: "Total des groupes",
    icon: MessageText1,
    accent: "from-primary/10 to-purple-500/10",
  },
  {
    label: "Recharges",
    value: statistics ? formatNumber(statistics.rechargeCount) : "0",
    trend: "Nombre de recharges",
    icon: Chart,
    accent: "from-emerald-100/60 to-emerald-50",
  },
  {
    label: "Crédit disponible",
    value: statistics ? formatCurrency(statistics.smsCredit) : "0 FCFA",
    trend: "Recharge recommandée",
    icon: WalletMoney,
    accent: "from-amber-100/70 to-amber-50",
  },
  {
    label: "Contacts",
    value: statistics ? formatNumber(statistics.contactCount) : "0",
    trend: "Total des contacts",
    icon: People,
    accent: "from-sky-100/70 to-sky-50",
  },
];

const quickActions = [
  {
    title: "Envoyer une campagne SMS",
    description: "Planifiez ou expédiez vos messages ciblés en quelques clics.",
    href: "/sms",
    cta: "Accéder à l'outil",
  },
  {
    title: "Ajouter des crédits",
    description: "Rechargez votre solde pour éviter toute interruption de campagne.",
    href: "/recharge",
    cta: "Recharger",
  },
  {
    title: "Gérer les contacts",
    description: "Importez, segmentez et maintenez vos listes à jour.",
    href: "/contacts",
    cta: "Ouvrir le module",
  },
];

function SkeletonCard() {
  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

function GlobalSkeletonCard() {
  return (
    <Card className="border border-border/60 shadow-sm bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-9 w-32 mb-2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-1 w-12 rounded-full" />
          <Skeleton className="h-3 w-40" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardHome() {
  const { statistics, isLoading } = useMainStatistics();
  const kpiCards = getKpiCards(statistics);

  return (
    <div className="space-y-8 p-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Vue d'ensemble
          </p>
          <h1 className="bg-linear-to-r from-primary via-purple-500 to-primary-light bg-clip-text text-3xl font-bold text-transparent">
            Tableau de bord
          </h1>
          <p className="mt-2 text-muted-foreground">
            Surveillez vos campagnes SMS, vos recharges et l'engagement de vos
            contacts en temps réel.
          </p>
        </div>
        <Button asChild className="rounded-full px-6">
          <a href="/sms" className="flex items-center gap-2">
            Nouvelle campagne
            <ArrowRight2 size="18" className="transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            kpiCards.map((kpi) => (
              <Card key={kpi.label} className="border border-border/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                  </CardTitle>
                  <div
                    className={`rounded-full bg-linear-to-br ${kpi.accent} p-2`}
                  >
                    <kpi.icon size="20" color="currentColor" variant="Bulk" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.trend}</p>
                </CardContent>
              </Card>
            ))
          )}

        {isLoading ? (
          <GlobalSkeletonCard />
        ) : (
          <GlobalSmsCard
            label="SMS envoyés (global)"
            value={statistics ? formatNumber(statistics.smsSentCount) : "0"}
            trend="Total des SMS envoyés"
          />
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-border/60">
          <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Performance des 30 derniers jours</CardTitle>
              <p className="text-sm text-muted-foreground">
                Volume de SMS envoyés et taux de délivrabilité par période.
              </p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              Exporter le rapport
            </Button>
          </CardHeader>
          <CardContent>
            <SmsTransactionChart />
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <p className="text-sm text-muted-foreground">
              Gagnez du temps en accédant directement aux modules clés.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className="rounded-xl border border-border/70 p-4 shadow-sm"
              >
                <h3 className="text-sm font-semibold">{action.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {action.description}
                </p>
                <Button asChild variant="ghost" className="mt-3 px-0 text-primary">
                  <a href={action.href} className="inline-flex items-center gap-1 text-sm font-semibold">
                    {action.cta}
                    <ArrowRight2 size="16" color="currentColor" variant="Bulk" className="text-primary" />
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-1">
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Balance annuelle des recharges</CardTitle>
              <p className="text-sm text-muted-foreground">
                Montant rechargé par mois sur l&apos;année en cours.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <BalanceRechargeChart />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
