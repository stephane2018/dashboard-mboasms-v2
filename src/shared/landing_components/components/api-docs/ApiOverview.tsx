"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from '@/components/api-docs/CodeBlock';

export function ApiOverview() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <section id="introduction" className="mb-12">
          <h1 className="text-3xl font-bold mb-6">MboaSMS API Documentation</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Welcome to the MboaSMS API documentation. Our API enables you to programmatically send SMS messages, 
            check delivery status, and integrate SMS functionality into your applications.
          </p>

          <div className="bg-muted/30 dark:bg-muted/20 border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Base URL</h2>
            <div className="bg-muted/50 dark:bg-background/95 p-3 rounded-md font-mono text-sm">
              https://api.mboasms.com/v1
            </div>
          </div>
        </section>

        <section id="authentication" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Authentication</h2>
          <p className="mb-4">
            All API requests require authentication using an API key. You can obtain your API key from your MboaSMS dashboard.
          </p>

          <div className="bg-muted/30 dark:bg-muted/20 border border-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">API Key Authentication</h3>
            <p className="mb-4">Include your API key in the request headers:</p>
            
            <Tabs defaultValue="curl">
              <TabsList className="mb-4">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              
              <TabsContent value="curl">
                <CodeBlock 
                  language="bash"
                  code={`curl -X POST https://api.mboasms.com/v1/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"to": "+237612345678", "message": "Hello from MboaSMS!"}'`}
                />
              </TabsContent>
              
              <TabsContent value="javascript">
                <CodeBlock 
                  language="javascript"
                  code={`fetch('https://api.mboasms.com/v1/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '+237612345678',
    message: 'Hello from MboaSMS!'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                />
              </TabsContent>
              
              <TabsContent value="python">
                <CodeBlock 
                  language="python"
                  code={`import requests

url = "https://api.mboasms.com/v1/send"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "to": "+237612345678",
    "message": "Hello from MboaSMS!"
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="rate-limiting" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Rate Limiting</h2>
          <p className="mb-4">
            To ensure the stability of our service, API requests are subject to rate limiting. The current limits are:
          </p>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/30 dark:bg-muted/20 border-b border-border">
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Rate Limit</th>
                  <th className="px-4 py-3 text-left">Period</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">Basic</td>
                  <td className="px-4 py-3">100 requests</td>
                  <td className="px-4 py-3">per minute</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">Premium</td>
                  <td className="px-4 py-3">500 requests</td>
                  <td className="px-4 py-3">per minute</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Enterprise</td>
                  <td className="px-4 py-3">1000 requests</td>
                  <td className="px-4 py-3">per minute</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-muted-foreground">
            When a rate limit is exceeded, the API will return a 429 Too Many Requests response. The response headers will include information about when you can retry.
          </p>
        </section>

        <section id="sms-api" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">SMS API</h2>
          
          <div className="bg-slate-200 dark:bg-black border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-500/20 text-green-500 rounded-md mr-2">POST</span>
                <span className="font-mono text-sm">/send</span>
              </div>
              <span className="text-sm text-muted-foreground">Send a single SMS</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Request Body</h3>
              <CodeBlock 
                language="json"
                code={`{
  "to": "+237612345678",     // Required: Recipient phone number in E.164 format
  "message": "Hello!",       // Required: Message content
  "sender_id": "MboaSMS",    // Optional: Custom sender ID
  "callback_url": "https://your-domain.com/callback"  // Optional: URL for delivery reports
}`}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Response</h3>
              <CodeBlock 
                language="json"
                code={`{
  "success": true,
  "message_id": "msg_1a2b3c4d5e6f",
  "status": "queued",
  "segments": 1,
  "credits_used": 1
}`}
              />
            </div>
          </div>
        </section>

        <section id="bulk-sms" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Bulk SMS</h2>
          
          <div className="bg-slate-200 dark:bg-black border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-500/20 text-green-500 rounded-md mr-2">POST</span>
                <span className="font-mono text-sm">/send/bulk</span>
              </div>
              <span className="text-sm text-muted-foreground">Send SMS to multiple recipients</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Request Body</h3>
              <CodeBlock 
                language="json"
                code={`{
  "messages": [
    {
      "to": "+237612345678",
      "message": "Hello from MboaSMS!"
    },
    {
      "to": "+237687654321",
      "message": "Another message from MboaSMS!"
    }
  ],
  "sender_id": "MboaSMS",    // Optional: Custom sender ID
  "callback_url": "https://your-domain.com/callback"  // Optional: URL for delivery reports
}`}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Response</h3>
              <CodeBlock 
                language="json"
                code={`{
  "success": true,
  "batch_id": "batch_1a2b3c4d5e6f",
  "messages": [
    {
      "message_id": "msg_1a2b3c4d5e6f",
      "to": "+237612345678",
      "status": "queued"
    },
    {
      "message_id": "msg_2b3c4d5e6f7g",
      "to": "+237687654321",
      "status": "queued"
    }
  ],
  "total_messages": 2,
  "total_segments": 2,
  "credits_used": 2
}`}
              />
            </div>
          </div>
        </section>

        <section id="delivery-reports" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Delivery Reports</h2>
          
          <div className="bg-slate-200 dark:bg-black border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-500 rounded-md mr-2">GET</span>
                <span className="font-mono text-sm">/messages/{'{message_id}'}/status</span>
              </div>
              <span className="text-sm text-muted-foreground">Check message delivery status</span>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Response</h3>
              <CodeBlock 
                language="json"
                code={`{
  "message_id": "msg_1a2b3c4d5e6f",
  "status": "delivered",
  "to": "+237612345678",
  "sent_at": "2023-06-12T14:30:00Z",
  "delivered_at": "2023-06-12T14:30:05Z"
}`}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Status Codes</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#2D2A37] border-b border-border">
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">queued</td>
                    <td className="px-4 py-3">Message has been accepted and queued for delivery</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">sent</td>
                    <td className="px-4 py-3">Message has been sent to the carrier</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">delivered</td>
                    <td className="px-4 py-3">Message has been delivered to the recipient</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">failed</td>
                    <td className="px-4 py-3">Message delivery failed</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">expired</td>
                    <td className="px-4 py-3">Message expired before it could be delivered</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="webhooks" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Webhooks</h2>
          <p className="mb-4">
            Webhooks allow you to receive real-time updates about the status of your messages. When a status change occurs, 
            we'll send a POST request to the URL you specified.
          </p>
          
          <div className="bg-slate-200 dark:bg-black border border-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Webhook Payload</h3>
            <CodeBlock 
              language="json"
              code={`{
  "event": "message.status_update",
  "message_id": "msg_1a2b3c4d5e6f",
  "status": "delivered",
  "to": "+237612345678",
  "sent_at": "2023-06-12T14:30:00Z",
  "delivered_at": "2023-06-12T14:30:05Z",
  "metadata": {
    // Any metadata you included with the original message
  }
}`}
            />
          </div>
          
          <div className="bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <h3 className="text-amber-500 font-medium mb-2">Security Best Practice</h3>
            <p className="text-sm">
              Always verify webhook signatures to ensure the requests are coming from MboaSMS. 
              We include a X-MboaSMS-Signature header with each webhook request.
            </p>
          </div>
        </section>

        <section id="error-codes" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Error Codes</h2>
          <p className="mb-4">
            When an error occurs, the API will return an appropriate HTTP status code and a JSON response with details about the error.
          </p>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/30 dark:bg-muted/20 border-b border-border">
                  <th className="px-4 py-3 text-left">Status Code</th>
                  <th className="px-4 py-3 text-left">Error Code</th>
                  <th className="px-4 py-3 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">400</td>
                  <td className="px-4 py-3">invalid_request</td>
                  <td className="px-4 py-3">The request was malformed or missing required parameters</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">401</td>
                  <td className="px-4 py-3">authentication_failed</td>
                  <td className="px-4 py-3">API key is missing or invalid</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">402</td>
                  <td className="px-4 py-3">insufficient_credits</td>
                  <td className="px-4 py-3">Your account doesn't have enough credits to send the message</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">403</td>
                  <td className="px-4 py-3">forbidden</td>
                  <td className="px-4 py-3">You don't have permission to access this resource</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">404</td>
                  <td className="px-4 py-3">not_found</td>
                  <td className="px-4 py-3">The requested resource was not found</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">429</td>
                  <td className="px-4 py-3">rate_limit_exceeded</td>
                  <td className="px-4 py-3">You've exceeded the rate limit for API requests</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">500</td>
                  <td className="px-4 py-3">server_error</td>
                  <td className="px-4 py-3">An error occurred on our servers</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-muted/30 dark:bg-muted/20 border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Error Response Format</h3>
            <CodeBlock 
              language="json"
              code={`{
  "success": false,
  "error": {
    "code": "invalid_request",
    "message": "The 'to' parameter is required",
    "details": {
      "field": "to",
      "issue": "missing_required_field"
    }
  }
}`}
            />
          </div>
        </section>
      </motion.div>
    </div>
  );
}
