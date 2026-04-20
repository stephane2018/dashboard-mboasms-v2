"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { useBulkSmsJobs } from "@/core/hooks/useBulkSms"
import { useT } from "@/core/hooks"
import { JobsDataTable } from "./_components/jobs-data-table"
import { JobDetailsModal } from "./_components/job-details-modal"
import type { BulkSmsJob } from "@/core/hooks/useBulkSms"

export default function SmsJobsPage() {
  const { t } = useT()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [selectedJob, setSelectedJob] = useState<BulkSmsJob | null>(null)

  const { data, isLoading, error } = useBulkSmsJobs(page, pageSize)

  const jobs = useMemo(() => data?.content || [], [data])

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/sms">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t('smsJobs.title')}</h1>
          <p className="text-xs text-muted-foreground">
            {t('smsJobs.subtitle')}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border bg-card">
        <JobsDataTable
          jobs={jobs}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          totalPages={data?.totalPages || 0}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onJobClick={setSelectedJob}
        />
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {t('smsJobs.errorLoading')}
          </p>
        </div>
      )}
    </div>
  )
}
