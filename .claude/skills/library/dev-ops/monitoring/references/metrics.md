# Metrics & Alerts

## Golden Signals (Google SRE)

1. **Latency**: Time it takes to service a request.
   - *Alert*: "99th percentile latency > 500ms for 5m".
2. **Traffic**: Demand on system (RPS).
   - *Alert*: "Traffic drops to 0" (System down?).
3. **Errors**: Rate of failed requests (HTTP 5xx).
   - *Alert*: "Error rate > 1%".
4. **Saturation**: How "full" is the system (CPU/RAM/Disk).
   - *Alert*: "Disk usage > 90%".

## Alert Fatigue

**Problem**: If the pager goes off 100 times a day for "CPU > 80%" and nothing breaks, engineers will ignore the real outage.

### Rules of Thumb
1. **Actionable**: If I get an alert, I must be able to DO something. If not, it's a log, not an alert.
2. **Symptom Based**: Alert on "User cannot login" (Symptom), not "Auth Service CPU high" (Cause). High CPU is fine if users are happy.
3. **Grouped**: Don't send 50 alerts for 50 failing instances. Send 1 "Cluster degraded".

## Service Level Objectives (SLO)

- **SLA**: Agreement with customer (Legal contract).
- **SLO**: Internal goal (Stricter than SLA).
- **SLI**: The actual metric (Indicator).

*Example*:
- **SLI**: HTTP 200/Total Requests.
- **SLO**: 99.9% over 30 days.
- **Error Budget**: The 0.1% failure we are allowed. Use it to ship risky features.
