---
name: scalability
description: Design scalable systems handling high traffic and data volume. Covers horizontal scaling, caching strategies, database sharding, and reliability patterns.
version: 1.0.0
tags: [Architecture, Scaling, Performance, Reliability, Distributed Systems]
---

# Scalability & Performance

Guide for designing systems that grow effortlessly from prototype to planet-scale.

## When to Use

- Planning for high traffic events (launches, sales)
- Optimizing slow API endpoints
- Designing distributed systems
- Addressing database bottlenecks
- Planning cost-effective infrastructure growth

## Quick Reference

### Core Scaling Patterns
1. **Horizontal Scaling** - Add more instances (stateless services)
2. **Vertical Scaling** - larger instances (simpler, temporary fix)
3. **Database Sharding** - Partition data by key (user_id, region)
4. **Caching Strategy** - Cache-aside, Write-through (Redis/Memcached)
5. **Asynchronous Processing** - Offload to queues (Kafka/RabbitMQ)
6. **CDN Offloading** - Serve static assets from edge
7. **Read Replicas** - Separate read/write traffic

### Reliability Patterns
- **Circuit Breaker**: Stop calling failing services
- **Bulkhead**: Isolate failure domains
- **Rate Limiting**: Protect resources from overload
- **Retry with Backoff**: Handle transient failures
- **Graceful Degradation**: Core features work when extras fail

## Full Compiled Guide

**Category Guide**: [../architecture/AGENTS.md](../architecture/AGENTS.md) - Complete architecture category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

### Patterns & Strategies
Detailed patterns in `references/patterns.md`:
- Caching hierarchies (L1/L2, Edge)
- Database partitioning (Sharding, Federation)
- Event-driven architecture (CQRS, Event Sourcing)
- Microservices vs Monolith scaling

### Performance Engineering
Methodologies in `references/performance.md`:
- Load testing (k6, JMeter)
- Capacity planning models
- Latency budgets & SLOs
- Resource optimization

### Reliability & Resilience
Stability guides in `references/reliability.md`:
- Fault tolerance patterns
- Chaos engineering
- Disaster recovery
- Observability at scale

## Key Metrics

- **Throughput**: Requests per second (RPS)
- **Latency**: p50, p95, p99 response times
- **Availability**: Uptime (99.9% -> 99.99%)
- **Error Rate**: Percentage of failed requests
- **Saturation**: CPU/Memory/Network utilization

## Tools

- **Load Testing**: k6, Artillery, JMeter
- **Caching**: Redis, Memcached, CDN
- **Queues**: Kafka, RabbitMQ, SQS
- **Monitoring**: Datadog, Prometheus, Grafana
