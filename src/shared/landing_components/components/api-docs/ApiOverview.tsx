"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CodeBlock } from './CodeBlock';

// ─── Reusable Components ─────────────────────────────────────────────────────

function MethodBadge({ method, size = "md" }: { method: string; size?: "sm" | "md" }) {
  const colors: Record<string, string> = {
    POST: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    GET: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20",
    PUT: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    DELETE: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
  };
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";
  return (
    <span className={`inline-block font-mono font-bold rounded-md border ${sizeClass} ${colors[method] || colors.POST}`}>
      {method}
    </span>
  );
}

function EndpointPath({ path }: { path: string }) {
  return (
    <code className="font-mono text-sm text-foreground/90 bg-muted/50 px-2 py-1 rounded-md">
      {path}
    </code>
  );
}

function ParamTable({ params }: { params: { name: string; type: string; required: boolean; description: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/30 dark:bg-muted/10 border-b border-border">
            <th className="px-4 py-2.5 text-left font-semibold text-foreground">Parameter</th>
            <th className="px-4 py-2.5 text-left font-semibold text-foreground">Type</th>
            <th className="px-4 py-2.5 text-left font-semibold text-foreground">Required</th>
            <th className="px-4 py-2.5 text-left font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p, i) => (
            <tr key={p.name} className={i < params.length - 1 ? "border-b border-border" : ""}>
              <td className="px-4 py-2.5 font-mono text-xs text-primary">{p.name}</td>
              <td className="px-4 py-2.5">
                <span className="text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground font-mono">{p.type}</span>
              </td>
              <td className="px-4 py-2.5">
                {p.required ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 font-semibold uppercase">Required</span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground font-medium uppercase">Optional</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoCard({ type, title, children }: { type: "info" | "warning" | "tip"; title: string; children: React.ReactNode }) {
  const styles = {
    info: "bg-sky-500/5 border-sky-500/20 [&_h4]:text-sky-600 dark:[&_h4]:text-sky-400",
    warning: "bg-amber-500/5 border-amber-500/20 [&_h4]:text-amber-600 dark:[&_h4]:text-amber-400",
    tip: "bg-emerald-500/5 border-emerald-500/20 [&_h4]:text-emerald-600 dark:[&_h4]:text-emerald-400",
  };
  const icons = {
    info: "ℹ️",
    warning: "⚠️",
    tip: "💡",
  };
  return (
    <div className={`rounded-lg border p-4 ${styles[type]}`}>
      <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
        <span>{icons[type]}</span> {title}
      </h4>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

function SectionDivider() {
  return <hr className="my-12 border-border/50" />;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ApiOverview() {
  const fadeIn = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <motion.div {...fadeIn}>
      {/* ── Introduction ──────────────────────────────────────────────── */}
      <section id="introduction" className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            MboaSMS API
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
            STABLE
          </span>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Integrate SMS messaging into your applications with the MboaSMS Developer API.
          Send single or bulk SMS to recipients across 50+ countries with reliable delivery and real-time tracking.
        </p>

        {/* Quick start cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { icon: "🚀", title: "Quick Start", desc: "Send your first SMS in under 2 minutes" },
            { icon: "🌍", title: "50+ Countries", desc: "International coverage with local pricing" },
            { icon: "⚡", title: "< 3s Delivery", desc: "Average delivery time worldwide" },
          ].map((card) => (
            <div key={card.title} className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className="font-semibold text-sm text-foreground">{card.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ── Base URL ──────────────────────────────────────────────────── */}
      <section id="base-url" className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Base URL</h2>
        <p className="text-muted-foreground mb-4">
          All API requests should be made to the following base URL:
        </p>
        <div className="p-4 rounded-xl bg-card border border-border">
          <code className="font-mono text-sm text-primary font-semibold">
            https://api.mboasms.com
          </code>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          All endpoints are relative to this base URL. For example, the send SMS endpoint is at{" "}
          <code className="font-mono text-xs bg-muted/50 px-1.5 py-0.5 rounded text-foreground">
            https://api.mboasms.com/api/v1/developer/sms/send
          </code>
        </p>
      </section>

      <SectionDivider />

      {/* ── Authentication ────────────────────────────────────────────── */}
      <section id="authentication" className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Authentication</h2>
        <p className="text-muted-foreground mb-6">
          The MboaSMS API supports two authentication methods. Choose the one that best fits your use case.
        </p>

        {/* Method 1: JWT */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
            JWT Token Authentication
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Authenticate by logging in to obtain a JWT token, then include it in the <code className="font-mono text-xs bg-muted/50 px-1.5 py-0.5 rounded text-foreground">Authorization</code> header of subsequent requests.
          </p>
          <CodeBlock
            language="bash"
            code={`# Include JWT token in the Authorization header
curl -X POST https://api.mboasms.com/api/v1/developer/sms/send \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumbers": ["+237670000000"],
    "message": "Hello from MboaSMS!",
    "senderId": "MboaSMS"
  }'`}
          />
        </div>

        {/* Method 2: Basic Auth */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
            Basic Authentication
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            For simpler integrations, use HTTP Basic Authentication with your username and password encoded in Base64. Use the dedicated <code className="font-mono text-xs bg-muted/50 px-1.5 py-0.5 rounded text-foreground">/send-with-auth</code> endpoint.
          </p>
          <CodeBlock
            language="bash"
            code={`# Basic Auth: username:password encoded in Base64
curl -X POST https://api.mboasms.com/api/v1/developer/sms/send-with-auth \\
  -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumbers": ["+237670000000"],
    "message": "Hello from MboaSMS!"
  }'`}
          />
        </div>

        <InfoCard type="warning" title="Keep your credentials secure">
          Never expose your JWT tokens or credentials in client-side code. Always make API calls from your backend server.
        </InfoCard>
      </section>

      <SectionDivider />

      {/* ── Rate Limiting ─────────────────────────────────────────────── */}
      <section id="rate-limiting" className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Rate Limiting</h2>
        <p className="text-muted-foreground mb-4">
          To ensure service stability, API requests are subject to rate limiting.
        </p>

        <div className="overflow-x-auto rounded-lg border border-border mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 dark:bg-muted/10 border-b border-border">
                <th className="px-4 py-3 text-left font-semibold">Plan</th>
                <th className="px-4 py-3 text-left font-semibold">Rate Limit</th>
                <th className="px-4 py-3 text-left font-semibold">Period</th>
              </tr>
            </thead>
            <tbody>
              {[
                { plan: "Standard", limit: "100 requests", period: "per minute" },
                { plan: "Premium", limit: "500 requests", period: "per minute" },
                { plan: "Enterprise", limit: "Custom", period: "Contact sales" },
              ].map((row, i) => (
                <tr key={row.plan} className={i < 2 ? "border-b border-border" : ""}>
                  <td className="px-4 py-3 font-medium text-foreground">{row.plan}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.limit}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InfoCard type="info" title="Rate limit exceeded">
          When rate limited, the API returns a <code className="font-mono text-xs">429 Too Many Requests</code> response.
          Retry after the duration indicated in the response headers.
        </InfoCard>
      </section>

      <SectionDivider />

      {/* ── Endpoint: Send SMS ────────────────────────────────────────── */}
      <section id="send-sms" className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-foreground">Send SMS</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <MethodBadge method="POST" />
          <EndpointPath path="/api/v1/developer/sms/send" />
        </div>
        <p className="text-muted-foreground mb-6">
          Send SMS messages to one or more phone numbers. The user and enterprise are identified via JWT token.
          Phone numbers can be in international format (<code className="font-mono text-xs bg-muted/50 px-1 py-0.5 rounded">+237</code>, <code className="font-mono text-xs bg-muted/50 px-1 py-0.5 rounded">+33</code>, etc.) or local format (<code className="font-mono text-xs bg-muted/50 px-1 py-0.5 rounded">670...</code>).
        </p>

        {/* Auth requirement */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-muted-foreground">Requires <span className="font-semibold text-foreground">JWT Authentication</span></span>
        </div>

        {/* Request Body */}
        <h3 className="text-base font-semibold text-foreground mb-3">Request Body</h3>
        <ParamTable
          params={[
            { name: "phoneNumbers", type: "string[]", required: true, description: "Array of recipient phone numbers (international or local format)" },
            { name: "message", type: "string", required: true, description: "The SMS message content to send" },
            { name: "senderId", type: "string", required: false, description: "Custom sender ID. Defaults to the company sender ID if not provided" },
          ]}
        />

        {/* Code examples */}
        <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Examples</h3>

        <div className="space-y-4">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">cURL</div>
            <CodeBlock
              language="bash"
              code={`curl -X POST https://api.mboasms.com/api/v1/developer/sms/send \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumbers": ["+237670000000", "+33612345678"],
    "message": "Bonjour! Votre code de verification est: 1234",
    "senderId": "MboaSMS"
  }'`}
            />
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">JavaScript (Node.js)</div>
            <CodeBlock
              language="javascript"
              code={`const response = await fetch(
  "https://api.mboasms.com/api/v1/developer/sms/send",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_JWT_TOKEN",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumbers: ["+237670000000", "+33612345678"],
      message: "Bonjour! Votre code de verification est: 1234",
      senderId: "MboaSMS",
    }),
  }
);

const data = await response.json();
console.log(data);`}
            />
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Python</div>
            <CodeBlock
              language="python"
              code={`import requests

response = requests.post(
    "https://api.mboasms.com/api/v1/developer/sms/send",
    headers={
        "Authorization": "Bearer YOUR_JWT_TOKEN",
        "Content-Type": "application/json",
    },
    json={
        "phoneNumbers": ["+237670000000", "+33612345678"],
        "message": "Bonjour! Votre code de verification est: 1234",
        "senderId": "MboaSMS",
    },
)

print(response.json())`}
            />
          </div>
        </div>

        {/* Response */}
        <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Response</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">200</span>
              <span className="text-sm text-muted-foreground">SMS sent successfully</span>
            </div>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "message": "SMS sent successfully",
  "data": {
    "totalSent": 2,
    "totalFailed": 0,
    "creditsUsed": 2
  }
}`}
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Endpoint: Send SMS with Basic Auth ────────────────────────── */}
      <section id="send-sms-auth" className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-foreground">Send SMS (Basic Auth)</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <MethodBadge method="POST" />
          <EndpointPath path="/api/v1/developer/sms/send-with-auth" />
        </div>
        <p className="text-muted-foreground mb-6">
          Send SMS messages using HTTP Basic Authentication (username:password encoded in Base64).
          This is a simpler alternative when JWT token management is not desired.
        </p>

        {/* Auth requirement */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-muted-foreground">Requires <span className="font-semibold text-foreground">Basic Authentication</span> header</span>
        </div>

        {/* Headers */}
        <h3 className="text-base font-semibold text-foreground mb-3">Headers</h3>
        <ParamTable
          params={[
            { name: "Authorization", type: "string", required: true, description: "Basic {base64(username:password)}" },
            { name: "Content-Type", type: "string", required: true, description: "application/json" },
          ]}
        />

        {/* Request Body */}
        <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Request Body</h3>
        <ParamTable
          params={[
            { name: "phoneNumbers", type: "string[]", required: true, description: "Array of recipient phone numbers" },
            { name: "message", type: "string", required: true, description: "The SMS message content" },
            { name: "senderId", type: "string", required: false, description: "Custom sender ID" },
          ]}
        />

        <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Example</h3>
        <CodeBlock
          language="bash"
          code={`# Encode credentials: echo -n "username:password" | base64
curl -X POST https://api.mboasms.com/api/v1/developer/sms/send-with-auth \\
  -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumbers": ["+237670000000"],
    "message": "Test message via Basic Auth"
  }'`}
        />

        {/* Response */}
        <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Responses</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">200</span>
              <span className="text-sm text-muted-foreground">SMS sent successfully</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400">401</span>
              <span className="text-sm text-muted-foreground">Unauthorized - invalid credentials</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">402</span>
              <span className="text-sm text-muted-foreground">Insufficient credits</span>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Endpoint: Send Bulk SMS ───────────────────────────────────── */}
      <section id="send-bulk" className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-foreground">Send Bulk SMS</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <MethodBadge method="POST" />
          <EndpointPath path="/api/v1/developer/sms/send-bulk" />
        </div>
        <p className="text-muted-foreground mb-6">
          Send SMS messages in bulk from an Excel (<code className="font-mono text-xs bg-muted/50 px-1 py-0.5 rounded">.xlsx</code>) or CSV file.
          This endpoint is ideal for large-scale campaigns with personalized messages per recipient.
        </p>

        {/* Auth requirement */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-muted-foreground">Requires <span className="font-semibold text-foreground">JWT Authentication</span></span>
        </div>

        {/* File format info */}
        <InfoCard type="tip" title="File Format">
          <div className="space-y-1.5 mt-1">
            <p><strong>Column 1 (required):</strong> Phone number</p>
            <p><strong>Column 2 (optional):</strong> Message — if not present, the <code className="font-mono text-xs bg-muted/30 px-1 rounded">message</code> query parameter is required</p>
            <p><strong>Supported formats:</strong> .xlsx, .csv</p>
            <p><strong>CSV delimiters:</strong> comma (,), semicolon (;), or tab</p>
          </div>
        </InfoCard>

        {/* Query Parameters */}
        <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Query Parameters</h3>
        <ParamTable
          params={[
            { name: "message", type: "string", required: false, description: "Default message if the file doesn't contain a messages column" },
            { name: "senderId", type: "string", required: false, description: "Custom sender ID. Defaults to the company sender ID if not provided" },
          ]}
        />

        {/* Request Body */}
        <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Request Body (multipart/form-data)</h3>
        <ParamTable
          params={[
            { name: "file", type: "binary", required: true, description: "Excel (.xlsx) or CSV file with phone numbers and optionally messages" },
          ]}
        />

        <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Example</h3>
        <CodeBlock
          language="bash"
          code={`# With personalized messages in the file
curl -X POST "https://api.mboasms.com/api/v1/developer/sms/send-bulk" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -F "file=@contacts.xlsx"

# With a default message for all recipients
curl -X POST "https://api.mboasms.com/api/v1/developer/sms/send-bulk?message=Hello%20from%20MboaSMS&senderId=MyApp" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -F "file=@phone_numbers.csv"`}
        />

        {/* CSV example */}
        <h3 className="text-base font-semibold text-foreground mt-6 mb-3">CSV File Example</h3>
        <CodeBlock
          language="text"
          code={`+237670000000,Bonjour Jean! Votre commande #1234 est prete.
+237680000000,Bonjour Marie! Votre commande #5678 est prete.
+33612345678,Hello Paul! Your order #9012 is ready.`}
        />

        {/* Responses */}
        <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Responses</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">200</span>
              <span className="text-sm text-muted-foreground">Bulk SMS processed successfully</span>
            </div>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "message": "Bulk SMS processed successfully",
  "data": {
    "totalSent": 150,
    "totalFailed": 3,
    "creditsUsed": 150
  }
}`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400">400</span>
              <span className="text-sm text-muted-foreground">Invalid file or request</span>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Response Format ───────────────────────────────────────────── */}
      <section id="response-format" className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Response Format</h2>
        <p className="text-muted-foreground mb-6">
          All API endpoints return JSON responses following a consistent format:
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-2">Success Response</h3>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "message": "SMS sent successfully",
  "data": {
    "totalSent": 2,
    "totalFailed": 0,
    "creditsUsed": 2
  }
}`}
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground mb-2">Error Response</h3>
            <CodeBlock
              language="json"
              code={`{
  "success": false,
  "message": "Invalid request",
  "error": {
    "code": "INVALID_PHONE_NUMBER",
    "details": "One or more phone numbers are invalid"
  }
}`}
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Error Codes ───────────────────────────────────────────────── */}
      <section id="error-codes" className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Error Codes</h2>
        <p className="text-muted-foreground mb-4">
          The API uses standard HTTP status codes to indicate the success or failure of requests.
        </p>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 dark:bg-muted/10 border-b border-border">
                <th className="px-4 py-3 text-left font-semibold">Code</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: "200", status: "OK", desc: "Request succeeded — SMS sent or processed", color: "emerald" },
                { code: "400", status: "Bad Request", desc: "Invalid request — missing or malformed parameters, invalid file format", color: "red" },
                { code: "401", status: "Unauthorized", desc: "Authentication failed — invalid or missing JWT token / Basic Auth credentials", color: "red" },
                { code: "402", status: "Payment Required", desc: "Insufficient credits — recharge your account to continue sending", color: "amber" },
                { code: "429", status: "Too Many Requests", desc: "Rate limit exceeded — wait before retrying", color: "amber" },
                { code: "500", status: "Server Error", desc: "Internal server error — contact support if the issue persists", color: "red" },
              ].map((row, i) => {
                const colorMap: Record<string, string> = {
                  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                  red: "bg-red-500/15 text-red-600 dark:text-red-400",
                  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                };
                return (
                  <tr key={row.code} className={i < 5 ? "border-b border-border" : ""}>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colorMap[row.color]}`}>{row.code}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{row.status}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.desc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <SectionDivider />

    </motion.div>
  );
}
