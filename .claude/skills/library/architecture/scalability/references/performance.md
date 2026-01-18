# Performance Engineering

## Load Testing

Testing system behavior under simulated traffic.

### Types of Tests
1. **Load Test**: Expected normal and peak traffic. Verify SLA.
2. **Stress Test**: Push beyond limits to find breaking point.
3. **Soak Test**: Long duration (24h+) to find leaks/degradation.
4. **Spike Test**: Sudden burst of traffic (e.g., ticket launch).

### Tools
- **k6**: JS based, modern, developer friendly.
- **JMeter**: Java based, UI heavy, enterprise standard.
- **Artillery**: Node.js based, great for socket.io.

### Example k6 Script
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up
    { duration: '1m30s', target: 10 }, // Hold
    { duration: '20s', target: 0 }, // Ramp down
  ],
};

export default function () {
  const res = http.get('https://api.example.com/users');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
```

## Capacity Planning

Modeling hardware needs based on traffic projections.

### The Math
1. **Estimate Traffic**: Requests per second (RPS).
2. **Estimate Data**: Storage growth per day/year.
3. **Calculate Resources**:
   - `Required CPUs = Target RPS / RPS per Core`
   - `Required RAM = Active Working Set Size + Overhead`

### Little's Law
`L = λW`
- **L**: Average number of items in system (Concurrency)
- **λ**: Arrival rate (RPS)
- **W**: Average wait time (Latency)

*Example*: If you process 100 req/s and each takes 0.5s:
`Concurrency = 100 * 0.5 = 50 active threads needed`

## Optimization Hierarchy

1. **Architecture**: Caching, Async (Biggest wins)
2. **Database**: Indexes, Query optimization, Schema
3. **Code**: Algorithms, needless loops, N+1 queries
4. **Infrastructure**: Network, OS tuning (Kernel params)

## Latency Budgets

Defining max allowance for operations.

| Operation | Budget |
|-----------|--------|
| API Response | 200ms |
| DB Query | 10ms |
| Redis Fetch | 1ms |
| External API | 500ms |

**SLO (Service Level Objective)**: "99.9% of requests < 200ms"
