---
name: reliability-ops
description: Expert standards for system reliability, chaos engineering, threat modeling, and incident response. Covers blast radius reduction, post-mortems, and security architecture.
version: 1.0.0
tags: [Security, Reliability, SRE, Chaos Engineering, Incident Response]
---

# Reliability & Security Operations (SecOps)

Building systems that survive the unexpected.

## When to Use

- Performing a Threat Model for a new feature
- Designing for high availability and disaster recovery
- Managing a production incident
- Implementing Chaos Engineering experiments

## Quick Reference

### Threat Modeling (STRIDE)
1. **Spoofing**: Identity theft.
2. **Tampering**: Data modification.
3. **Repudiation**: Denying actions.
4. **Information Disclosure**: Data leaks.
5. **Denial of Service**: Crashing the system.
6. **Elevation of Privilege**: Unauthorized access.

### Incident Command
- **Incident Commander (IC)**: The one in charge.
- **Communications (Comms)**: Updates stakeholders.
- **Operations (Ops)**: Fixes the bug.
- **Rule**: Never fix without an IC. No "Too many cooks".

## Full Compiled Guide

**Category Guide**: [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Complete crosscutting category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

### Threat Modeling
Guide in `references/threat-modeling.md`:
- STRIDE methodology
- Data flow diagrams
- Risk mitigation strategies

### Chaos & Reliability
Guide in `references/chaos-reliability.md`:
- Chaos Engineering principles
- Error budgets (SLOs)
- Disaster Recovery (RTO/RPO)

### Incident Management
Guide in `references/incidents.md`:
- SEV levels (1-4)
- Post-mortem (Blameless) culture
- On-call rotations

## Key Metrics

- **MTTR (Mean Time to Recovery)**: Speed of fix.
- **MTTD (Mean Time to Detection)**: Speed of alert.
- **Availability (9s)**: 99.9%, 99.99%, etc.

## Tools

- **Gremlin / Chaos Monkey**: Chaos Engineering.
- **PagerDuty / Opsgenie**: Incident alerting.
- **Cloudflare**: DDoS protection.
- **Snyk / Dependabot**: Security scanning.
