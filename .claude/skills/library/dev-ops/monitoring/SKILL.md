---
name: monitoring
description: Observability standards. Covers logging, metrics, alerting, and distributed tracing.
version: 1.0.0
tags: [DevOps, Monitoring, Observability, Logging, Metrics]
---

# Observability & Monitoring

Understanding what is happening inside your system.

## When to Use

- Debugging production incidents
- Setting up alerts for downtime
- Analyzing performance bottlenecks
- Auditing user activity

## Quick Reference

### The Three Pillars
1. **Logs**: Discrete events (e.g., "User logged in").
2. **Metrics**: Aggregated numbers (e.g., "CPU usage is 80%").
3. **Traces**: Request lifecycle across services (e.g., Frontend -> API -> DB).

## Full Compiled Guide

**Category Guide**: [../dev-ops/AGENTS.md](../dev-ops/AGENTS.md) - Complete dev-ops category with all patterns and examples

**Individual AGENTS.md**: [AGENTS.md](./AGENTS.md) - Comprehensive observability and monitoring guide (40+ patterns)

### What's in AGENTS.md

**Observability Fundamentals** (CRITICAL):
- Three pillars (logs, metrics, traces)
- Observability vs monitoring
- Golden signals (latency, traffic, errors, saturation)
- SLOs and SLAs with error budgets

**Logging** (CRITICAL):
- Structured JSON logging
- Log levels (DEBUG, INFO, WARN, ERROR, FATAL)
- Log correlation with trace IDs
- PII redaction for security and GDPR compliance
- Log aggregation to central systems

**Metrics** (CRITICAL):
- Metric types (counter, gauge, histogram)
- Golden signals implementation
- Application metrics (user actions, features)
- Infrastructure metrics (CPU, memory, database)
- Business metrics (revenue, conversions, churn)

**Alerting** (CRITICAL):
- Effective alert rules (thresholds, duration)
- Alert fatigue prevention
- On-call rotation best practices
- Runbooks for common incidents

**Distributed Tracing** (HIGH):
- Trace context propagation
- Span creation and management
- OpenTelemetry integration
- Trace visualization and analysis

**Error Tracking** (CRITICAL):
- Sentry integration for production errors
- Error grouping and deduplication
- Stack trace analysis
- Release tracking and comparison

**Performance Monitoring** (HIGH):
- Real User Monitoring (RUM)
- Synthetic monitoring
- Core Web Vitals tracking
- API latency measurement

**Infrastructure Monitoring** (HIGH):
- System resources (CPU, memory, disk)
- Database connection pools and query performance
- Cache hit rates (Redis)
- Queue depths and backlogs

**Business Metrics** (MEDIUM):
- Conversion funnels tracking
- User engagement (DAU, MAU)
- Revenue and LTV metrics
- Custom KPIs

**Pulwave Integration** (CRITICAL):
- Logging setup with Winston
- Sentry integration for error tracking
- TanStack Query metrics
- Supabase monitoring and RLS debugging

**Appendices**:
- Complete monitoring checklist
- Golden signals reference
- Log levels guide
- Alert template and runbook example

## Additional Resources

### Logging Patterns
Guide in `references/logging.md`:
- Structured Json Logging
- Log Levels (INFO vs DEBUG)
- PII Redaction

### Metrics & Alerts
Guide in `references/metrics.md`:
- Golden Signals (Latency, Traffic, Errors, Saturation)
- Alert Fatigue prevention
- SLO/SLA definitions

## Tools

- **Datadog**: All-in-one SaaS.
- **Prometheus + Grafana**: Open Source metrics.
- **ELK Stack**: Elastic, Logstash, Kibana (Logs).
- **Sentry**: Error Tracking.
- **OpenTelemetry**: Standard for instrumentation.
