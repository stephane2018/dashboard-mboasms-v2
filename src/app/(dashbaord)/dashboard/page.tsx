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
  Refresh2,
  Sun1,
  Moon,
  Cloud,
  ArrowUp,
} from "iconsax-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { SmsTransactionChart } from "@/modules/sms/components/sms-transaction-chart";
import { GlobalSmsCard } from "./components/global-sms-card";
import { BalanceRechargeChart } from "./components/balance-recharge-chart";
import { Skeleton } from "@/shared/ui/skeleton";
import { useMainStatistics, useT } from "@/core/hooks";
import { useAuth } from "@/core/hooks/useAuth";
import { cn } from "@/lib/utils";

const formatNumber = (num: number) => new Intl.NumberFormat("fr-FR").format(num);
const formatCurrency = (num: number) =>
  new Intl.NumberFormat("fr-FR").format(num) + " FCFA";

function getGreeting(t: (k: string) => string) {
  const h = new Date().getHours();
  if (h < 12) return { label: t("dashboard.greetingMorning"), Icon: Sun1, color: "text-amber-500" };
  if (h < 18) return { label: t("dashboard.greetingAfternoon"), Icon: Cloud, color: "text-sky-500" };
  return { label: t("dashboard.greetingEvening"), Icon: Moon, color: "text-indigo-500" };
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  trend: string;
  Icon: typeof Send2;
  color: string;
  bg: string;
  ringColor: string;
  accent: string;
}

function KpiCard({ label, value, trend, Icon, color, bg, ringColor, accent }: KpiCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5",
        "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
        "hover:border-border"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "[background-image:radial-gradient(circle_at_top_right,var(--tw-gradient-from)_0%,transparent_70%)]",
          accent
        )}
      />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
          </div>
          <div className={cn("rounded-xl p-2.5 ring-1", bg, ringColor)}>
            <Icon size={18} color="currentColor" variant="Bulk" className={color} />
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground leading-none tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <ArrowUp size={11} color="currentColor" variant="Bulk" className="text-emerald-500" />
          {trend}
        </p>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { statistics, isLoading, refetch } = useMainStatistics();
  const { t } = useT();
  const { user, enterprise } = useAuth();

  const greeting = getGreeting(t);
  const userName =
    (typeof user?.name === "string" && user.name.trim()) ||
    user?.email?.split("@")[0] ||
    "";
  const firstName = userName.split(" ")[0];
  const initials =
    (userName || user?.email || "?")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const enterpriseName =
    typeof enterprise?.socialRaison === "string" ? enterprise.socialRaison : null;

  const kpiCards: KpiCardProps[] = [
    {
      label: t("dashboard.groups"),
      value: statistics ? formatNumber(statistics.groupCount) : "0",
      trend: t("dashboard.totalGroups"),
      Icon: MessageText1,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10",
      ringColor: "ring-violet-200/50 dark:ring-violet-500/20",
      accent: "from-violet-500/15",
    },
    {
      label: t("dashboard.recharges"),
      value: statistics ? formatNumber(statistics.rechargeCount) : "0",
      trend: t("dashboard.rechargeCount"),
      Icon: Chart,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      ringColor: "ring-emerald-200/50 dark:ring-emerald-500/20",
      accent: "from-emerald-500/15",
    },
    {
      label: t("dashboard.availableCredit"),
      value: statistics ? formatCurrency(statistics.smsCredit) : "0 FCFA",
      trend: t("dashboard.rechargeRecommended"),
      Icon: WalletMoney,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      ringColor: "ring-amber-200/50 dark:ring-amber-500/20",
      accent: "from-amber-500/15",
    },
    {
      label: t("dashboard.contacts"),
      value: statistics ? formatNumber(statistics.contactCount) : "0",
      trend: t("dashboard.totalContacts"),
      Icon: People,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-500/10",
      ringColor: "ring-sky-200/50 dark:ring-sky-500/20",
      accent: "from-sky-500/15",
    },
  ];

  const quickActions = [
    {
      title: t("dashboard.sendCampaign"),
      description: t("dashboard.sendCampaignDesc"),
      href: "/sms",
      Icon: Send2,
      color: "text-primary",
      bg: "bg-primary/5 hover:bg-primary/10",
      iconBg: "bg-primary/15",
      ring: "ring-primary/20",
    },
    {
      title: t("dashboard.rechargeBalance"),
      description: t("dashboard.rechargeBalanceDesc"),
      href: "/recharge",
      Icon: WalletAdd,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50/70 hover:bg-emerald-100 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10",
      iconBg: "bg-emerald-500/15",
      ring: "ring-emerald-500/20",
    },
    {
      title: t("dashboard.manageContacts"),
      description: t("dashboard.manageContactsDesc"),
      href: "/contacts",
      Icon: Profile2User,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50/70 hover:bg-sky-100 dark:bg-sky-500/5 dark:hover:bg-sky-500/10",
      iconBg: "bg-sky-500/15",
      ring: "ring-sky-500/20",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* Hero header */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-6">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_top_right,theme(colors.primary/15),transparent_60%),radial-gradient(circle_at_bottom_left,theme(colors.indigo.500/10),transparent_55%)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-14 w-14 ring-2 ring-background shadow-md shrink-0">
              <AvatarImage src={enterprise?.urlImage || user?.avatar} alt={userName} />
              <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <greeting.Icon size={16} color="currentColor" variant="Bulk" className={greeting.color} />
                <span className="text-xs font-medium text-muted-foreground">
                  {greeting.label}{firstName ? `, ${firstName}` : ''} 👋
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                {enterpriseName || t("dashboard.title")}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("dashboard.heroSubtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2 bg-background/60 backdrop-blur"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <Refresh2 size={14} variant="Bulk" className={cn(isLoading && "animate-spin")} />
              {t("common.refresh")}
            </Button>
            <Button
              asChild
              size="sm"
              className={cn(
                "rounded-xl px-5 gap-2 bg-primary text-white font-semibold",
                "shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
                "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              )}
            >
              <a href="/sms">
                <Send2 size={14} variant="Bulk" color="currentColor" />
                {t("dashboard.newCampaign")}
                <ArrowRight2 size={14} variant="Bulk" color="currentColor" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* KPI section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Chart size={12} color="currentColor" variant="Bulk" className="text-primary" />
            {t("dashboard.kpiOverview")}
          </h2>
        </div>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            kpiCards.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)
          )}
        </div>
        {!isLoading && (
          <div className="grid gap-3 grid-cols-1">
            <GlobalSmsCard
              label={t("dashboard.smsSentGlobal")}
              value={statistics ? formatNumber(statistics.smsSentCount) : "0"}
              trend={t("dashboard.totalSmsSent")}
            />
          </div>
        )}
      </section>

      {/* Charts + Quick Actions */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Chart size={14} color="currentColor" variant="Bulk" className="text-primary" />
                  {t("dashboard.smsPerformance")}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("dashboard.smsVolumeByPeriod")}
                </p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <SmsTransactionChart />
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Send2 size={14} color="currentColor" variant="Bulk" className="text-primary" />
              {t("dashboard.quickActions")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("dashboard.quickActionsDesc")}
            </p>
          </div>
          <div className="p-3 space-y-2">
            {quickActions.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border border-transparent p-3",
                  "transition-all duration-200 hover:border-border/60 hover:shadow-sm",
                  action.bg
                )}
              >
                <div className={cn("shrink-0 rounded-lg p-2.5 ring-1", action.iconBg, action.ring)}>
                  <action.Icon size={18} color="currentColor" variant="Bulk" className={action.color} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{action.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed truncate">
                    {action.description}
                  </p>
                </div>
                <ArrowRight2
                  size={14}
                  color="currentColor"
                  variant="Bulk"
                  className={cn(
                    "shrink-0 transition-transform group-hover:translate-x-0.5",
                    action.color
                  )}
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Balance Recharge Chart */}
      <section>
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <WalletMoney size={14} color="currentColor" variant="Bulk" className="text-primary" />
              {t("dashboard.balanceRecharges")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("dashboard.balanceRechargesDesc")}
            </p>
          </div>
          <div className="p-5">
            <BalanceRechargeChart />
          </div>
        </div>
      </section>
    </div>
  );
}
