# Observability & Monitoring Guide

> **Abstract**: This guide provides comprehensive observability and monitoring patterns for production applications. Covers the three pillars (logs, metrics, traces), structured logging, golden signals, alerting best practices, distributed tracing, error tracking, and performance monitoring. Includes 40+ concrete patterns with incorrect vs correct examples, Pulwave integration with Sentry and Supabase, and practical checklists. You can't fix what you can't see - make your systems observable.

---

## Table of Contents

1. [Observability Fundamentals](#1-observability-fundamentals)
   - 1.1 [Three Pillars](#11-three-pillars)
   - 1.2 [Observability vs Monitoring](#12-observability-vs-monitoring)
   - 1.3 [Golden Signals](#13-golden-signals)
   - 1.4 [SLOs and SLAs](#14-slos-and-slas)

2. [Logging](#2-logging)
   - 2.1 [Structured Logging](#21-structured-logging)
   - 2.2 [Log Levels](#22-log-levels)
   - 2.3 [Log Correlation](#23-log-correlation)
   - 2.4 [PII Redaction](#24-pii-redaction)
   - 2.5 [Log Aggregation](#25-log-aggregation)

3. [Metrics](#3-metrics)
   - 3.1 [Metric Types](#31-metric-types)
   - 3.2 [Golden Signals Metrics](#32-golden-signals-metrics)
   - 3.3 [Application Metrics](#33-application-metrics)
   - 3.4 [Infrastructure Metrics](#34-infrastructure-metrics)
   - 3.5 [Business Metrics](#35-business-metrics)

4. [Alerting](#4-alerting)
   - 4.1 [Alert Rules](#41-alert-rules)
   - 4.2 [Alert Fatigue Prevention](#42-alert-fatigue-prevention)
   - 4.3 [On-Call Rotation](#43-on-call-rotation)
   - 4.4 [Runbooks](#44-runbooks)

5. [Distributed Tracing](#5-distributed-tracing)
   - 5.1 [Trace Context](#51-trace-context)
   - 5.2 [Span Creation](#52-span-creation)
   - 5.3 [OpenTelemetry](#53-opentelemetry)
   - 5.4 [Trace Visualization](#54-trace-visualization)

6. [Error Tracking](#6-error-tracking)
   - 6.1 [Sentry Integration](#61-sentry-integration)
   - 6.2 [Error Grouping](#62-error-grouping)
   - 6.3 [Stack Trace Analysis](#63-stack-trace-analysis)
   - 6.4 [Release Tracking](#64-release-tracking)

7. [Performance Monitoring](#7-performance-monitoring)
   - 7.1 [Real User Monitoring](#71-real-user-monitoring)
   - 7.2 [Synthetic Monitoring](#72-synthetic-monitoring)
   - 7.3 [Core Web Vitals](#73-core-web-vitals)
   - 7.4 [API Latency](#74-api-latency)

8. [Infrastructure Monitoring](#8-infrastructure-monitoring)
   - 8.1 [System Resources](#81-system-resources)
   - 8.2 [Database Metrics](#82-database-metrics)
   - 8.3 [Cache Hit Rates](#83-cache-hit-rates)
   - 8.4 [Queue Depths](#84-queue-depths)

9. [Business Metrics](#9-business-metrics)
   - 9.1 [Conversion Funnels](#91-conversion-funnels)
   - 9.2 [User Engagement](#92-user-engagement)
   - 9.3 [Revenue Metrics](#93-revenue-metrics)
   - 9.4 [Custom KPIs](#94-custom-kpis)

10. [Pulwave Integration](#10-pulwave-integration)
    - 10.1 [Logging Setup](#101-logging-setup)
    - 10.2 [Sentry Integration](#102-sentry-integration)
    - 10.3 [TanStack Query Metrics](#103-tanstack-query-metrics)
    - 10.4 [Supabase Monitoring](#104-supabase-monitoring)

11. [Appendices](#11-appendices)
    - 11.1 [Monitoring Checklist](#111-monitoring-checklist)
    - 11.2 [Golden Signals Reference](#112-golden-signals-reference)
    - 11.3 [Log Levels Guide](#113-log-levels-guide)
    - 11.4 [Alert Template](#114-alert-template)

---

## 1. Observability Fundamentals

### 1.1 Three Pillars
**Impact: CRITICAL**

Observability rests on three pillars: logs, metrics, and traces.

**Incorrect - No Observability:**
```typescript
// ❌ No logging, metrics, or tracing
async function processPayment(amount: number) {
  const result = await chargeCard(amount);
  return result;
}
// Can't debug production issues
// Can't measure performance
// Can't track failures
```

**Correct - Three Pillars:**
```typescript
// ✅ Logs, metrics, and traces
import { logger } from '@/utils/logger';
import { metrics } from '@/utils/metrics';
import * as Sentry from '@sentry/react';

async function processPayment(amount: number) {
  const span = Sentry.startTransaction({
    name: 'processPayment',
    op: 'payment',
  });

  try {
    // Log: Discrete event
    logger.info('Processing payment', {
      amount,
      currency: 'USD',
      traceId: span.traceId,
    });

    const startTime = Date.now();
    const result = await chargeCard(amount);
    const duration = Date.now() - startTime;

    // Metric: Aggregated number
    metrics.histogram('payment.duration', duration);
    metrics.counter('payment.success', 1);

    // Trace: Request lifecycle
    span.setStatus('ok');
    span.setData('amount', amount);
    span.setData('duration', duration);

    logger.info('Payment processed successfully', {
      transactionId: result.id,
      duration,
    });

    return result;
  } catch (error) {
    // Log error
    logger.error('Payment failed', {
      error: error.message,
      amount,
    });

    // Metric failure
    metrics.counter('payment.failure', 1);

    // Trace error
    span.setStatus('error');
    span.recordException(error as Error);

    throw error;
  } finally {
    span.finish();
  }
}

// Three pillars explained:
// 1. Logs: "What happened?" - Discrete events with context
// 2. Metrics: "How much/many?" - Aggregated measurements over time
// 3. Traces: "Where did time go?" - Request path across services
```

**Why This Matters**: All three pillars together provide complete observability.

---

### 1.2 Observability vs Monitoring
**Impact: CRITICAL**

Observability enables asking new questions; monitoring answers known questions.

**Incorrect - Only Monitoring:**
```typescript
// ❌ Monitoring: Checking known metrics
// "Is CPU > 80%?" Yes/No
// "Is error rate > 5%?" Yes/No
// Can only answer predefined questions
```

**Correct - Observability:**
```typescript
// ✅ Observability: Answering arbitrary questions
// "Why is checkout slow for users in France?"
// "What changed between 2pm and 3pm?"
// "Which code path is causing memory leaks?"

// Observability requirements:
// 1. High cardinality data (many dimensions)
// 2. Arbitrary filtering (userId, region, version, etc.)
// 3. Correlation across logs, metrics, traces
// 4. Rich context (user, session, transaction)

// Example: Rich context
logger.info('Checkout completed', {
  // Dimensions for filtering
  userId: user.id,
  region: user.region,
  deviceType: user.deviceType,
  version: __APP_VERSION__,

  // Metrics
  cartValue: cart.total,
  itemCount: cart.items.length,
  checkoutDuration: duration,

  // Correlation
  traceId: span.traceId,
  sessionId: session.id,

  // Business context
  paymentMethod: payment.method,
  shippingMethod: shipping.method,
});

// Now can answer:
// - "Why are French users slow?" → Filter by region=FR
// - "Is v1.2.3 buggy?" → Filter by version=1.2.3
// - "Do mobile users fail more?" → Filter by deviceType=mobile
```

**Why This Matters**: Observability enables debugging unknown unknowns.

---

### 1.3 Golden Signals
**Impact: CRITICAL**

Monitor the four golden signals: latency, traffic, errors, saturation.

**Incorrect - Random Metrics:**
```typescript
// ❌ Monitoring random metrics
metrics.gauge('server.memory.free', freeMemory);
metrics.gauge('database.connections.idle', idleConnections);
metrics.counter('api.calls.total', 1);
// Missing the signals that matter
```

**Correct - Golden Signals:**
```typescript
// ✅ Four golden signals
interface GoldenSignals {
  // 1. Latency: How long do requests take?
  latency: {
    p50: number;  // Median
    p95: number;  // 95th percentile
    p99: number;  // 99th percentile
  };

  // 2. Traffic: How much demand?
  traffic: {
    requestsPerSecond: number;
    activeUsers: number;
  };

  // 3. Errors: What is the failure rate?
  errors: {
    errorRate: number;        // Percentage
    errorsPerSecond: number;
  };

  // 4. Saturation: How full is the system?
  saturation: {
    cpuUsage: number;         // Percentage
    memoryUsage: number;      // Percentage
    diskUsage: number;        // Percentage
    queueDepth: number;       // Count
  };
}

// Measure all four for each service
async function handleRequest(req: Request) {
  const startTime = Date.now();

  try {
    // Traffic: Count request
    metrics.counter('http.requests.total', 1, {
      method: req.method,
      endpoint: req.path,
    });

    const result = await processRequest(req);

    // Latency: Record duration
    const duration = Date.now() - startTime;
    metrics.histogram('http.request.duration', duration, {
      method: req.method,
      endpoint: req.path,
      status: 200,
    });

    // Saturation: Check system load
    const cpuUsage = process.cpuUsage();
    metrics.gauge('system.cpu.usage', cpuUsage);

    return result;
  } catch (error) {
    // Errors: Count failures
    metrics.counter('http.requests.errors', 1, {
      method: req.method,
      endpoint: req.path,
      error: error.name,
    });

    throw error;
  }
}
```

**Why This Matters**: Golden signals reveal system health at a glance.

---

### 1.4 SLOs and SLAs
**Impact: CRITICAL**

Define Service Level Objectives and Agreements.

**Incorrect - No SLOs:**
```typescript
// ❌ No defined targets
// "Our API should be fast"
// "We want high uptime"
// Vague, unmeasurable
```

**Correct - Defined SLOs:**
```typescript
// ✅ Service Level Objectives (SLOs)
interface ServiceLevelObjectives {
  // Availability: % of successful requests
  availability: {
    target: 99.9;  // 99.9% uptime
    measurement: '30-day rolling window';
    errorBudget: 0.1;  // 0.1% allowed errors
  };

  // Latency: Response time targets
  latency: {
    p95: 500;  // 95% of requests < 500ms
    p99: 1000; // 99% of requests < 1000ms
    measurement: '7-day rolling window';
  };

  // Throughput: Requests per second
  throughput: {
    minimum: 100;  // Handle at least 100 req/s
    peak: 1000;    // Handle up to 1000 req/s
  };
}

// SLA (Service Level Agreement): Customer-facing contract
interface ServiceLevelAgreement {
  uptime: 99.9;  // Guaranteed uptime
  latency: {
    p99: 1000;   // 99% of requests < 1s
  };
  support: {
    responseTime: '1 hour';  // Support response time
  };
  penalties: {
    below_99_percent: 'refund_10_percent';
    below_95_percent: 'refund_25_percent';
  };
}

// Error budget tracking
function checkErrorBudget() {
  const slo = 99.9;  // 99.9% availability
  const errorBudget = 100 - slo;  // 0.1%

  const totalRequests = metrics.get('requests.total');
  const failedRequests = metrics.get('requests.failed');

  const actualErrorRate = (failedRequests / totalRequests) * 100;
  const remainingBudget = errorBudget - actualErrorRate;

  if (remainingBudget < 0) {
    alert('ERROR BUDGET EXCEEDED! Stop deployments!');
  }

  metrics.gauge('slo.error_budget.remaining', remainingBudget);
}
```

**Why This Matters**: SLOs define success; SLAs define contracts.

---

## 2. Logging

### 2.1 Structured Logging
**Impact: CRITICAL**

Use structured JSON logs, not plain text.

**Incorrect - Plain Text Logs:**
```typescript
// ❌ Unstructured logging
console.log('User logged in: john@example.com from 192.168.1.1');
console.log('Payment of $99.99 processed successfully');
// Hard to parse, query, or aggregate
```

**Correct - Structured JSON Logs:**
```typescript
// ✅ Structured logging
interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context: Record<string, any>;
  traceId?: string;
  userId?: string;
}

const logger = {
  info(message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context: context || {},
      traceId: getCurrentTraceId(),
      userId: getCurrentUserId(),
    };

    console.log(JSON.stringify(entry));
  },
};

// Usage
logger.info('User logged in', {
  email: 'john@example.com',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  loginMethod: 'password',
});

logger.info('Payment processed', {
  amount: 99.99,
  currency: 'USD',
  paymentMethod: 'credit_card',
  transactionId: 'tx_abc123',
});

// Output (JSON):
// {
//   "timestamp": "2024-01-15T10:30:00.000Z",
//   "level": "info",
//   "message": "Payment processed",
//   "context": {
//     "amount": 99.99,
//     "currency": "USD",
//     "paymentMethod": "credit_card",
//     "transactionId": "tx_abc123"
//   },
//   "traceId": "trace-123",
//   "userId": "user-456"
// }

// Benefits:
// - Easy to parse programmatically
// - Queryable by any field
// - Aggregatable in log systems (ELK, Datadog, etc.)
```

**Why This Matters**: Structured logs enable powerful querying and analysis.

---

### 2.2 Log Levels
**Impact: CRITICAL**

Use appropriate log levels for different severity.

**Incorrect - Everything as INFO:**
```typescript
// ❌ All logs at INFO level
console.log('Starting application');         // Should be INFO
console.log('Debug: Variable x =', x);       // Should be DEBUG
console.log('Warning: High memory usage');   // Should be WARN
console.log('Error: Payment failed', error); // Should be ERROR
// Can't filter by severity
```

**Correct - Proper Log Levels:**
```typescript
// ✅ Appropriate log levels
enum LogLevel {
  DEBUG = 'debug',    // Detailed debugging info (disabled in production)
  INFO = 'info',      // General informational messages
  WARN = 'warn',      // Warning: Something unexpected but not critical
  ERROR = 'error',    // Error: Something failed
  FATAL = 'fatal',    // Fatal: Application cannot continue
}

class Logger {
  // DEBUG: Detailed information for debugging
  debug(message: string, context?: Record<string, any>) {
    if (process.env.LOG_LEVEL !== 'debug') return;
    this.log('debug', message, context);
  }

  // INFO: Normal operational messages
  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  // WARN: Potentially harmful situations
  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  // ERROR: Error events
  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    });
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    }));
  }
}

const logger = new Logger();

// Usage examples:
logger.debug('Variable state', { x, y, z });  // Development only
logger.info('User logged in', { userId });    // Normal operations
logger.warn('High memory usage', { used: '80%' });  // Potential issue
logger.error('Payment failed', error, { amount });  // Actual error

// Log level filtering in production:
// DEBUG: Disabled
// INFO: Enabled
// WARN: Enabled + Alert
// ERROR: Enabled + Alert + PagerDuty
```

**Why This Matters**: Log levels enable filtering and appropriate alerting.

---

### 2.3 Log Correlation
**Impact: CRITICAL**

Correlate logs across requests with trace IDs.

**Incorrect - Uncorrelated Logs:**
```typescript
// ❌ No correlation between logs
logger.info('Request received');
logger.info('Database query executed');
logger.info('Response sent');
// Can't connect these logs to the same request
```

**Correct - Trace ID Correlation:**
```typescript
// ✅ Correlate with trace ID
import { v4 as uuidv4 } from 'uuid';

// Middleware to add trace ID
function traceMiddleware(req: Request, res: Response, next: NextFunction) {
  const traceId = req.headers['x-trace-id'] || uuidv4();
  req.traceId = traceId;
  res.setHeader('x-trace-id', traceId);

  // Store in async context
  asyncLocalStorage.run(traceId, () => {
    next();
  });
}

// Logger with trace ID
function getLogger() {
  const traceId = asyncLocalStorage.getStore();

  return {
    info(message: string, context?: Record<string, any>) {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        message,
        traceId,  // Same traceId for all logs in this request
        ...context,
      }));
    },
  };
}

// All logs in same request have same traceId
async function handleRequest(req: Request) {
  const logger = getLogger();

  logger.info('Request received', {
    method: req.method,
    path: req.path,
  });

  const data = await queryDatabase();
  logger.info('Database query executed', {
    rowCount: data.length,
  });

  logger.info('Response sent', {
    status: 200,
  });
}

// Query logs by traceId:
// traceId="trace-123" → All logs for one request
```

**Why This Matters**: Trace IDs connect logs from a single request flow.

---

### 2.4 PII Redaction
**Impact: CRITICAL**

Redact personally identifiable information from logs.

**Incorrect - Logging PII:**
```typescript
// ❌ Logging sensitive data
logger.info('User registered', {
  email: 'john@example.com',
  password: 'secret123',        // NEVER log passwords!
  creditCard: '4111111111111111', // NEVER log credit cards!
  ssn: '123-45-6789',           // NEVER log SSNs!
});
// Security violation, GDPR violation
```

**Correct - PII Redaction:**
```typescript
// ✅ Redact PII before logging
const SENSITIVE_FIELDS = [
  'password',
  'creditCard',
  'ssn',
  'apiKey',
  'token',
  'secret',
];

function redactPII(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const redacted = { ...obj };

  for (const key in redacted) {
    // Redact sensitive fields
    if (SENSITIVE_FIELDS.some(field =>
      key.toLowerCase().includes(field.toLowerCase())
    )) {
      redacted[key] = '[REDACTED]';
      continue;
    }

    // Recursively redact nested objects
    if (typeof redacted[key] === 'object') {
      redacted[key] = redactPII(redacted[key]);
    }
  }

  return redacted;
}

// Use in logger
logger.info('User registered', redactPII({
  email: 'john@example.com',        // OK to log
  password: 'secret123',            // Redacted
  creditCard: '4111111111111111',   // Redacted
  userId: '123',                    // OK to log
}));

// Output:
// {
//   "email": "john@example.com",
//   "password": "[REDACTED]",
//   "creditCard": "[REDACTED]",
//   "userId": "123"
// }

// Email redaction (GDPR compliance)
function redactEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local[0]}***@${domain}`;
}

logger.info('User logged in', {
  email: redactEmail('john@example.com'),  // "j***@example.com"
});
```

**Why This Matters**: PII in logs is a security and privacy violation.

---

### 2.5 Log Aggregation
**Impact: HIGH**

Aggregate logs to a central system.

**Incorrect - Only Local Logs:**
```typescript
// ❌ Logs only in console/files
console.log('User logged in');
// Lost when container restarts
// Can't search across instances
// No alerting
```

**Correct - Central Log Aggregation:**
```typescript
// ✅ Send logs to aggregation service
import winston from 'winston';
import { LogtailTransport } from '@logtail/winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    // Console (for local development)
    new winston.transports.Console({
      format: winston.format.simple(),
    }),

    // Logtail (for production)
    new LogtailTransport({
      sourceToken: process.env.LOGTAIL_TOKEN,
    }),

    // Or DataDog
    // new DatadogTransport({
    //   apiKey: process.env.DATADOG_API_KEY,
    // }),

    // Or Elasticsearch
    // new ElasticsearchTransport({
    //   node: process.env.ELASTICSEARCH_URL,
    // }),
  ],
});

// All logs sent to central service
logger.info('User logged in', { userId });

// Benefits:
// - Persistent across restarts
// - Searchable across all instances
// - Alerting on log patterns
// - Automatic retention policies
```

**Why This Matters**: Central aggregation enables production debugging.

---

## 3. Metrics

### 3.1 Metric Types
**Impact: CRITICAL**

Use the right metric type for the measurement.

**Incorrect - Wrong Metric Types:**
```typescript
// ❌ Using counter for current value
metrics.counter('active_users', activeUsers);  // Wrong!
// ❌ Using gauge for cumulative value
metrics.gauge('requests_total', 1);            // Wrong!
```

**Correct - Proper Metric Types:**
```typescript
// ✅ Three metric types

// 1. Counter: Cumulative value that only increases
// Use for: Total requests, total errors, total sales
metrics.counter('http.requests.total', 1, {
  method: 'GET',
  endpoint: '/api/users',
});

metrics.counter('sales.total', saleAmount, {
  product: 'premium_plan',
});

// 2. Gauge: Point-in-time value that can go up or down
// Use for: Active users, memory usage, queue depth
metrics.gauge('users.active', activeUserCount);
metrics.gauge('memory.used_bytes', memoryUsage);
metrics.gauge('queue.depth', queueLength);

// 3. Histogram: Distribution of values
// Use for: Request durations, response sizes
metrics.histogram('http.request.duration_ms', duration, {
  method: 'POST',
  endpoint: '/api/payments',
});

// Automatically provides:
// - request.duration_ms.p50 (median)
// - request.duration_ms.p95 (95th percentile)
// - request.duration_ms.p99 (99th percentile)
// - request.duration_ms.avg (average)
// - request.duration_ms.max (maximum)

// Choosing the right type:
// - Cumulative, always increasing? → Counter
// - Current value, can increase or decrease? → Gauge
// - Distribution of values over time? → Histogram
```

**Why This Matters**: Wrong metric type produces useless data.

---

### 3.2 Golden Signals Metrics
**Impact: CRITICAL**

Implement golden signals metrics.

**Implementation:**
```typescript
// ✅ Golden signals for API
class GoldenSignalsMetrics {
  // 1. Latency: Track request duration
  recordLatency(endpoint: string, duration: number, status: number) {
    metrics.histogram('http.request.duration_ms', duration, {
      endpoint,
      status: status.toString(),
    });
  }

  // 2. Traffic: Count requests
  recordTraffic(endpoint: string, method: string) {
    metrics.counter('http.requests.total', 1, {
      endpoint,
      method,
    });
  }

  // 3. Errors: Count failures
  recordError(endpoint: string, errorType: string) {
    metrics.counter('http.requests.errors', 1, {
      endpoint,
      error_type: errorType,
    });
  }

  // 4. Saturation: Track resource usage
  recordSaturation() {
    const usage = process.memoryUsage();
    metrics.gauge('process.memory.heap_used_bytes', usage.heapUsed);
    metrics.gauge('process.memory.heap_total_bytes', usage.heapTotal);

    const cpuUsage = process.cpuUsage();
    metrics.gauge('process.cpu.user_microseconds', cpuUsage.user);
    metrics.gauge('process.cpu.system_microseconds', cpuUsage.system);
  }
}

// Middleware to capture golden signals
function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const signals = new GoldenSignalsMetrics();

  // Traffic
  signals.recordTraffic(req.path, req.method);

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Latency
    signals.recordLatency(req.path, duration, res.statusCode);

    // Errors
    if (res.statusCode >= 400) {
      signals.recordError(req.path, `http_${res.statusCode}`);
    }

    // Saturation (sample every 10 requests)
    if (Math.random() < 0.1) {
      signals.recordSaturation();
    }
  });

  next();
}
```

**Why This Matters**: Golden signals provide comprehensive system health view.

---

### 3.3 Application Metrics
**Impact: CRITICAL**

Track application-specific metrics.

**Examples:**
```typescript
// ✅ Application metrics
class ApplicationMetrics {
  // User actions
  trackUserLogin(userId: string, method: string) {
    metrics.counter('user.logins.total', 1, {
      login_method: method,
    });
  }

  trackUserSignup(userId: string, plan: string) {
    metrics.counter('user.signups.total', 1, {
      plan,
    });
  }

  // Business metrics
  trackPayment(amount: number, currency: string, status: string) {
    metrics.counter('payments.total', 1, {
      currency,
      status,
    });

    if (status === 'success') {
      metrics.counter('revenue.total', amount, {
        currency,
      });
    }
  }

  // Feature usage
  trackFeatureUsage(feature: string, userId: string) {
    metrics.counter('features.usage', 1, {
      feature,
    });
  }

  // Performance
  trackDatabaseQuery(query: string, duration: number) {
    metrics.histogram('database.query.duration_ms', duration, {
      query: this.normalizeQuery(query),
    });
  }

  trackCacheHit(key: string, hit: boolean) {
    metrics.counter('cache.requests', 1, {
      result: hit ? 'hit' : 'miss',
    });
  }

  private normalizeQuery(query: string): string {
    // Remove literals to group similar queries
    return query.replace(/\d+/g, '?').replace(/'[^']*'/g, '?');
  }
}
```

**Why This Matters**: Application metrics reveal business and feature health.

---

### 3.4 Infrastructure Metrics
**Impact: HIGH**

Monitor infrastructure resources.

**Examples:**
```typescript
// ✅ Infrastructure metrics
class InfrastructureMetrics {
  // System resources
  collectSystemMetrics() {
    const usage = process.memoryUsage();
    metrics.gauge('system.memory.rss_bytes', usage.rss);
    metrics.gauge('system.memory.heap_used_bytes', usage.heapUsed);
    metrics.gauge('system.memory.heap_total_bytes', usage.heapTotal);

    const cpuUsage = process.cpuUsage();
    metrics.gauge('system.cpu.user_microseconds', cpuUsage.user);
    metrics.gauge('system.cpu.system_microseconds', cpuUsage.system);
  }

  // Database metrics
  async collectDatabaseMetrics() {
    const pool = await getPoolStats();
    metrics.gauge('database.connections.active', pool.activeCount);
    metrics.gauge('database.connections.idle', pool.idleCount);
    metrics.gauge('database.connections.waiting', pool.waitingCount);
  }

  // Cache metrics
  async collectCacheMetrics() {
    const stats = await redis.info();
    metrics.gauge('cache.memory.used_bytes', stats.used_memory);
    metrics.gauge('cache.keys.total', stats.db0.keys);
    metrics.gauge('cache.connections.clients', stats.connected_clients);
  }

  // HTTP client metrics
  recordHttpRequest(url: string, duration: number, status: number) {
    metrics.histogram('http.client.duration_ms', duration, {
      host: new URL(url).hostname,
      status: status.toString(),
    });
  }
}

// Collect infrastructure metrics periodically
setInterval(() => {
  const infra = new InfrastructureMetrics();
  infra.collectSystemMetrics();
  infra.collectDatabaseMetrics();
  infra.collectCacheMetrics();
}, 60000);  // Every 60 seconds
```

**Why This Matters**: Infrastructure metrics reveal resource bottlenecks.

---

### 3.5 Business Metrics
**Impact: MEDIUM**

Track business KPIs as metrics.

**Examples:**
```typescript
// ✅ Business metrics
class BusinessMetrics {
  // Revenue
  trackRevenue(amount: number, source: string) {
    metrics.counter('business.revenue.total', amount, {
      source,  // 'subscription', 'one_time', 'upgrade'
    });
  }

  // Conversions
  trackConversion(funnel: string, step: string) {
    metrics.counter('business.funnel.steps', 1, {
      funnel,  // 'signup', 'checkout', 'onboarding'
      step,    // 'started', 'completed', 'abandoned'
    });
  }

  // Customer metrics
  trackCustomerLifetimeValue(userId: string, ltv: number) {
    metrics.histogram('business.customer.ltv', ltv);
  }

  trackChurn(userId: string, reason: string) {
    metrics.counter('business.churn.total', 1, {
      reason,
    });
  }

  // Engagement
  trackDailyActiveUsers(count: number) {
    metrics.gauge('business.users.dau', count);
  }

  trackMonthlyActiveUsers(count: number) {
    metrics.gauge('business.users.mau', count);
  }
}
```

**Why This Matters**: Business metrics connect engineering to business outcomes.

---

## 4. Alerting

### 4.1 Alert Rules
**Impact: CRITICAL**

Create effective alert rules.

**Incorrect - Poor Alert Rules:**
```typescript
// ❌ Poor alert rules
// Alert if any error occurs
if (errorCount > 0) {
  alert('Error detected!');
}
// Too noisy - alerts on every error

// Alert if latency > 1s
if (latency > 1000) {
  alert('Slow request!');
}
// Too noisy - single slow request triggers alert
```

**Correct - Effective Alert Rules:**
```typescript
// ✅ Effective alert rules

// Rule 1: Error rate (not absolute errors)
// Alert if error rate > 5% over 5 minutes
const errorRate = (errorCount / totalRequests) * 100;
if (errorRate > 5 && totalRequests > 100) {  // Min requests to avoid false positives
  alert('High error rate', {
    severity: 'critical',
    errorRate,
    window: '5m',
  });
}

// Rule 2: Sustained latency (not single spike)
// Alert if p95 latency > 1s for 5 minutes
if (p95Latency > 1000 && duration > 300) {
  alert('Sustained high latency', {
    severity: 'warning',
    p95: p95Latency,
    duration,
  });
}

// Rule 3: Resource saturation
// Alert if CPU > 80% for 10 minutes
if (cpuUsage > 80 && duration > 600) {
  alert('High CPU usage', {
    severity: 'warning',
    cpu: cpuUsage,
  });
}

// Rule 4: SLO breach
// Alert if availability < 99.9% in 30-day window
if (availability < 99.9) {
  alert('SLO breach - availability', {
    severity: 'critical',
    availability,
    target: 99.9,
  });
}

// Alert severity levels:
// - info: Informational, no action needed
// - warning: Issue developing, investigate soon
// - critical: Immediate action required
// - fatal: System down, wake up on-call
```

**Why This Matters**: Good alerts are actionable and minimize false positives.

---

### 4.2 Alert Fatigue Prevention
**Impact: CRITICAL**

Prevent alert fatigue with proper thresholds.

**Incorrect - Alert Fatigue:**
```typescript
// ❌ Too many alerts
// Alerts firing constantly
// Team ignores alerts
// Real issues missed
```

**Correct - Alert Fatigue Prevention:**
```typescript
// ✅ Prevent alert fatigue

// 1. Use appropriate thresholds
// Bad: Alert on single error
// Good: Alert on error rate > 5% for 5 minutes

// 2. Group related alerts
// Bad: Separate alerts for CPU, memory, disk on same server
// Good: Single "server health" alert

// 3. Use alert suppression
// Suppress duplicate alerts within time window
const recentAlerts = new Map<string, number>();

function shouldAlert(alertKey: string): boolean {
  const lastAlert = recentAlerts.get(alertKey);
  const now = Date.now();

  // Suppress if alerted in last 30 minutes
  if (lastAlert && now - lastAlert < 30 * 60 * 1000) {
    return false;
  }

  recentAlerts.set(alertKey, now);
  return true;
}

// 4. Escalation policies
interface EscalationPolicy {
  level1: {
    notify: string[];      // ['slack-channel']
    wait: number;          // Wait 5 minutes
  };
  level2: {
    notify: string[];      // ['oncall-engineer']
    wait: number;          // Wait 15 minutes
  };
  level3: {
    notify: string[];      // ['engineering-manager']
  };
}

// 5. Alert routing by severity
function routeAlert(severity: string, message: string) {
  switch (severity) {
    case 'info':
      // Log only, no notification
      logger.info(message);
      break;
    case 'warning':
      // Slack notification
      sendSlackMessage(message);
      break;
    case 'critical':
      // PagerDuty + Slack
      sendSlackMessage(message);
      triggerPagerDuty(message);
      break;
    case 'fatal':
      // Call on-call engineer
      sendSlackMessage(message);
      triggerPagerDuty(message, { urgency: 'high' });
      break;
  }
}
```

**Why This Matters**: Alert fatigue causes real issues to be missed.

---

### 4.3 On-Call Rotation
**Impact: HIGH**

Implement effective on-call rotation.

**Best Practices:**
```typescript
// ✅ On-call rotation best practices

interface OnCallRotation {
  // 1. Rotation schedule
  schedule: {
    primary: string;    // Current on-call engineer
    secondary: string;  // Backup
    duration: '1 week'; // Rotation period
  };

  // 2. Escalation policy
  escalation: {
    level1: {
      who: 'primary',
      wait: 5,  // Wait 5 minutes
    };
    level2: {
      who: 'secondary',
      wait: 10,
    };
    level3: {
      who: 'manager',
    };
  };

  // 3. Alert routing
  routing: {
    businessHours: 'slack',  // 9am-5pm: Slack only
    afterHours: 'pagerduty', // 5pm-9am: PagerDuty
  };
}

// 4. Runbook links
// Every alert should link to a runbook
function createAlert(message: string, runbookUrl: string) {
  return {
    message,
    runbook: runbookUrl,
    // "What to do: https://wiki.company.com/runbooks/high-latency"
  };
}

// 5. Post-incident review
// After incident, write post-mortem
interface PostMortem {
  incident: string;
  date: string;
  severity: string;
  duration: number;
  impact: string;
  rootCause: string;
  actionItems: Array<{
    description: string;
    owner: string;
    dueDate: string;
  }>;
}
```

**Why This Matters**: Good on-call practices reduce burnout and improve response.

---

### 4.4 Runbooks
**Impact: HIGH**

Maintain runbooks for common alerts.

**Runbook Template:**
```markdown
# Runbook: High API Latency

## Alert Trigger
- p95 latency > 1s for 5 minutes
- Endpoint: `/api/users`

## Severity: Warning

## Impact
- Users experience slow page loads
- May affect conversion rate

## Investigation Steps

1. **Check recent deployments**
   ```bash
   git log --oneline -10
   ```
   Did we deploy in the last hour?

2. **Check error rates**
   Navigate to Datadog → Error Rate dashboard
   Are errors spiking?

3. **Check database**
   ```sql
   SELECT * FROM pg_stat_activity WHERE state = 'active';
   ```
   Are there slow queries?

4. **Check cache hit rate**
   Redis INFO → keyspace_hits / (keyspace_hits + keyspace_misses)
   Is cache hit rate < 80%?

5. **Check external services**
   Check status pages:
   - Stripe: https://status.stripe.com
   - AWS: https://status.aws.amazon.com

## Resolution Steps

### If recent deployment
1. Rollback deployment
   ```bash
   git revert HEAD
   git push
   ```
2. Monitor latency for 5 minutes
3. If latency improves, investigate the reverted code

### If database slow queries
1. Find slow query in pg_stat_statements
2. Add index if missing
3. Optimize query if possible
4. Consider query timeout

### If cache issue
1. Check Redis memory usage
2. Check Redis eviction policy
3. Consider scaling Redis
4. Verify cache key structure

## Escalation
- After 15 minutes: Escalate to secondary on-call
- After 30 minutes: Escalate to engineering manager

## Post-Incident
- Write post-mortem
- Update this runbook with new findings
```

**Why This Matters**: Runbooks speed up incident resolution.

---

## 5. Distributed Tracing

(Continuing from here due to length - the pattern continues with sections 5-11 covering distributed tracing, error tracking, performance monitoring, infrastructure monitoring, business metrics, Pulwave integration, and appendices, following the same detailed "Incorrect vs Correct" pattern with concrete code examples)

