# State Machines

---

## 1. User Session State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER SESSION STATE MACHINE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                              ┌─────────────┐                                │
│                              │   INITIAL   │                                │
│                              └──────┬──────┘                                │
│                                     │ check_session                         │
│                       ┌─────────────┴─────────────┐                         │
│                       ▼                           ▼                         │
│              ┌─────────────┐             ┌─────────────────┐               │
│              │UNAUTHENTICATED            │   LOADING_USER  │               │
│              └──────┬──────┘             └────────┬────────┘               │
│                     │ login                       │ user_loaded             │
│                     ▼                             ▼                         │
│              ┌─────────────┐             ┌─────────────────┐               │
│              │ LOGGING_IN  │             │ LOADING_ORGS    │               │
│              └──────┬──────┘             └────────┬────────┘               │
│                     │ success                     │ orgs_loaded             │
│                     ▼                             ▼                         │
│              ┌─────────────────────────────────────────────┐               │
│              │              ORG_SELECTION                   │               │
│              │  (User has multiple orgs, must select one)  │               │
│              └─────────────────────┬───────────────────────┘               │
│                                    │ org_selected                           │
│                                    ▼                                        │
│              ┌─────────────────────────────────────────────┐               │
│              │              APP_SELECTION                   │               │
│              │   (Org has multiple apps, must select one)  │               │
│              └─────────────────────┬───────────────────────┘               │
│                                    │ app_selected                           │
│                                    ▼                                        │
│              ┌─────────────────────────────────────────────┐               │
│              │                 READY                        │               │
│              │  Context: { user, org, app, permissions }   │               │
│              └─────────────────────┬───────────────────────┘               │
│                    │               │               │                        │
│            switch_org        switch_app         logout                      │
│                    │               │               │                        │
│                    ▼               ▼               ▼                        │
│           [ORG_SELECTION]  [APP_SELECTION]  [UNAUTHENTICATED]              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Organization/Tenant State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ORGANIZATION LIFECYCLE STATE MACHINE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐     create      ┌──────────┐                                 │
│  │  (none)  │ ───────────────►│ PENDING  │                                 │
│  └──────────┘                 └────┬─────┘                                 │
│                                    │ verify_owner                           │
│                                    ▼                                        │
│                              ┌──────────┐      subscribe     ┌──────────┐  │
│                              │  TRIAL   │ ──────────────────►│  ACTIVE  │  │
│                              └────┬─────┘                    └────┬─────┘  │
│                                   │                               │         │
│                           trial_expired                    payment_failed   │
│                                   │                               │         │
│                                   ▼                               ▼         │
│                              ┌──────────┐                   ┌──────────┐   │
│                              │ EXPIRED  │◄──────────────────│ PAST_DUE │   │
│                              └────┬─────┘   grace_expired   └────┬─────┘   │
│                                   │                               │         │
│                              reactivate                      payment_ok     │
│                                   │                               │         │
│                                   └───────────┬───────────────────┘         │
│                                               ▼                             │
│                                          ┌──────────┐                       │
│                                          │  ACTIVE  │                       │
│                                          └────┬─────┘                       │
│                                               │ cancel                      │
│                                               ▼                             │
│                                          ┌──────────┐                       │
│                                          │ CANCELED │                       │
│                                          └────┬─────┘                       │
│                                               │ delete_requested            │
│                                               ▼                             │
│                                          ┌──────────┐                       │
│                                          │ DELETING │                       │
│                                          └────┬─────┘                       │
│                                               │ data_deleted                │
│                                               ▼                             │
│                                          ┌──────────┐                       │
│                                          │ DELETED  │                       │
│                                          └──────────┘                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. App Registration State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         APP LIFECYCLE STATE MACHINE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  App = A registered application in the platform                             │
│  org_apps = Junction table linking orgs to apps they have access to         │
│                                                                              │
│                    ┌──────────┐                                             │
│                    │  (none)  │                                             │
│                    └────┬─────┘                                             │
│                         │ register_app                                       │
│                         ▼                                                    │
│                    ┌──────────┐                                             │
│                    │  DRAFT   │                                             │
│                    └────┬─────┘                                             │
│                         │ configure                                          │
│                         ▼                                                    │
│                    ┌──────────┐      approve       ┌──────────┐            │
│                    │ PENDING  │ ──────────────────►│  ACTIVE  │            │
│                    └──────────┘                    └────┬─────┘            │
│                                                         │                   │
│                                           ┌─────────────┴─────────────┐     │
│                                           │                           │     │
│                                      deprecate                    suspend   │
│                                           │                           │     │
│                                           ▼                           ▼     │
│                                     ┌──────────┐               ┌──────────┐ │
│                                     │DEPRECATED│               │SUSPENDED │ │
│                                     └────┬─────┘               └────┬─────┘ │
│                                          │                          │       │
│                                          │ sunset_date_reached      │       │
│                                          │                     reactivate   │
│                                          ▼                          │       │
│                                     ┌──────────┐                    │       │
│                                     │ RETIRED  │                    │       │
│                                     └──────────┘                    │       │
│                                                                     │       │
│                                     ┌───────────────────────────────┘       │
│                                     ▼                                       │
│                                ┌──────────┐                                 │
│                                │  ACTIVE  │                                 │
│                                └──────────┘                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Member Invitation State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MEMBER INVITATION STATE MACHINE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Invitation flow when admin invites a new user to an organization           │
│                                                                              │
│  ┌──────────┐     invite      ┌──────────────┐                             │
│  │  (none)  │ ───────────────►│   PENDING    │                             │
│  └──────────┘                 │ email_sent   │                             │
│                               └──────┬───────┘                             │
│                      ┌───────────────┼───────────────┐                     │
│                      │               │               │                     │
│                  expired         clicked        admin_cancel               │
│                (48h limit)          │               │                     │
│                      │               │               │                     │
│                      ▼               ▼               ▼                     │
│               ┌──────────┐    ┌──────────┐    ┌──────────┐                │
│               │ EXPIRED  │    │ ACCEPTED │    │ CANCELED │                │
│               └────┬─────┘    └────┬─────┘    └──────────┘                │
│                    │               │                                       │
│                 resend        has_account?                                │
│                    │         ┌─────┴─────┐                                │
│                    │         │           │                                │
│                    ▼        yes          no                               │
│               ┌──────────┐   │           │                                │
│               │ PENDING  │   │           ▼                                │
│               └──────────┘   │    ┌──────────────┐                        │
│                              │    │ REGISTRATION │                        │
│                              │    │  (Sign up)   │                        │
│                              │    └──────┬───────┘                        │
│                              │           │ completed                      │
│                              │           │                                │
│                              └─────┬─────┘                                │
│                                    │                                       │
│                                    ▼                                       │
│                              ┌──────────┐                                  │
│                              │  JOINED  │                                  │
│                              │ (member) │                                  │
│                              └──────────┘                                  │
│                                                                              │
│  INVITATION TABLE:                                                         │
│  ├── id, org_id, app_id, email, role_id                                   │
│  ├── token (secure random)                                                │
│  ├── status (pending, accepted, expired, canceled)                        │
│  ├── invited_by, invited_at                                               │
│  └── expires_at (invited_at + 48 hours)                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Lease Lifecycle State Machine (Real Estate)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEASE LIFECYCLE STATE MACHINE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐     create      ┌──────────┐                                 │
│  │  (none)  │ ───────────────►│  DRAFT   │                                 │
│  └──────────┘                 └────┬─────┘                                 │
│                                    │ send_for_review                       │
│                                    ▼                                       │
│                              ┌──────────┐                                  │
│                              │ PENDING  │◄──────────────┐                  │
│                              │ APPROVAL │               │                  │
│                              └────┬─────┘               │                  │
│                      ┌────────────┼────────────┐        │                  │
│                      │            │            │        │                  │
│                   reject       approve     request_changes                 │
│                      │            │            │        │                  │
│                      ▼            ▼            │        │                  │
│               ┌──────────┐ ┌──────────┐       │        │                  │
│               │ REJECTED │ │ APPROVED │       └────────┘                  │
│               └──────────┘ └────┬─────┘                                   │
│                                 │ send_for_signature                       │
│                                 ▼                                          │
│                           ┌──────────┐                                     │
│                           │ PENDING  │                                     │
│                           │SIGNATURE │                                     │
│                           └────┬─────┘                                     │
│                    ┌───────────┼───────────┐                              │
│                    │           │           │                              │
│                declined   landlord_signs  expired                         │
│                    │           │           │                              │
│                    ▼           ▼           ▼                              │
│             ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│             │ DECLINED │ │ AWAITING │ │ EXPIRED  │                        │
│             └──────────┘ │  TENANT  │ └──────────┘                        │
│                          └────┬─────┘                                     │
│                               │ tenant_signs                              │
│                               ▼                                           │
│                          ┌──────────┐                                     │
│                          │  SIGNED  │                                     │
│                          └────┬─────┘                                     │
│                               │ start_date_reached                        │
│                               ▼                                           │
│                          ┌──────────┐                                     │
│                          │  ACTIVE  │◄───────────────┐                    │
│                          └────┬─────┘                │                    │
│              ┌────────────────┼────────────────┐     │                    │
│              │                │                │     │                    │
│          end_date       early_terminate    renew    │                    │
│          reached             │                │     │                    │
│              │                │                │     │                    │
│              ▼                ▼                └─────┘                    │
│        ┌──────────┐    ┌──────────┐                                       │
│        │ EXPIRED  │    │TERMINATED│                                       │
│        └────┬─────┘    └────┬─────┘                                       │
│             │               │                                             │
│             │    ┌──────────┘                                             │
│             ▼    ▼                                                        │
│        ┌──────────┐                                                       │
│        │ ARCHIVED │                                                       │
│        └──────────┘                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Maintenance Request State Machine (Real Estate)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MAINTENANCE REQUEST STATE MACHINE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐     submit      ┌──────────┐                                 │
│  │  (none)  │ ───────────────►│   OPEN   │                                 │
│  └──────────┘                 └────┬─────┘                                 │
│                                    │ triage                                │
│                      ┌─────────────┼─────────────┐                         │
│                      │             │             │                         │
│                  duplicate    assign_tech    reject                        │
│                      │             │             │                         │
│                      ▼             ▼             ▼                         │
│               ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│               │DUPLICATE │  │ ASSIGNED │  │ REJECTED │                    │
│               └──────────┘  └────┬─────┘  └──────────┘                    │
│                                  │                                         │
│                            start_work                                      │
│                                  │                                         │
│                                  ▼                                         │
│                            ┌──────────┐                                    │
│                            │   IN     │                                    │
│                            │ PROGRESS │                                    │
│                            └────┬─────┘                                    │
│                   ┌─────────────┼─────────────┐                            │
│                   │             │             │                            │
│              need_parts    complete     cannot_fix                         │
│                   │             │             │                            │
│                   ▼             ▼             ▼                            │
│            ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│            │ PENDING  │  │ PENDING  │  │ ESCALATED│                       │
│            │  PARTS   │  │  REVIEW  │  └────┬─────┘                       │
│            └────┬─────┘  └────┬─────┘       │                             │
│                 │             │             │                             │
│          parts_arrived   ┌────┴────┐   vendor_assigned                    │
│                 │        │         │        │                             │
│                 │     approve   reopen      │                             │
│                 │        │         │        ▼                             │
│                 │        │         │  ┌──────────┐                        │
│                 │        │         │  │ EXTERNAL │                        │
│                 │        │         │  │  VENDOR  │                        │
│                 │        │         │  └────┬─────┘                        │
│                 │        │         │       │ vendor_complete              │
│                 │        │         │       │                              │
│                 └────────┤         │       │                              │
│                          │         │       │                              │
│                          ▼         │       │                              │
│                     ┌──────────┐   │       │                              │
│                     │COMPLETED │◄──┴───────┘                              │
│                     └────┬─────┘                                          │
│                          │ close (30 days)                                │
│                          ▼                                                │
│                     ┌──────────┐                                          │
│                     │  CLOSED  │                                          │
│                     └──────────┘                                          │
│                                                                              │
│  PRIORITY LEVELS: low (72h), medium (48h), high (24h), urgent (4h)        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Payment State Machine (Real Estate)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PAYMENT STATE MACHINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐   generate_invoice   ┌──────────┐                            │
│  │  (none)  │ ────────────────────►│ PENDING  │                            │
│  └──────────┘                      │ (due_date)│                            │
│                                    └────┬─────┘                            │
│                         ┌───────────────┼───────────────┐                  │
│                         │               │               │                  │
│                    due_passed     pay_full        pay_partial              │
│                         │               │               │                  │
│                         ▼               ▼               ▼                  │
│                   ┌──────────┐   ┌──────────┐   ┌──────────┐              │
│                   │ OVERDUE  │   │   PAID   │   │ PARTIAL  │              │
│                   └────┬─────┘   └──────────┘   └────┬─────┘              │
│                        │                             │                     │
│            ┌───────────┼───────────┐                │                     │
│            │           │           │           pay_remaining              │
│         pay_full   pay_partial   grace_end         │                     │
│            │           │           │                │                     │
│            ▼           ▼           ▼                │                     │
│       ┌──────────┐ ┌──────────┐ ┌──────────┐       │                     │
│       │PAID_LATE │ │ PARTIAL  │ │ DEFAULT  │       │                     │
│       │(+fee)    │ │ (+fee)   │ └────┬─────┘       │                     │
│       └──────────┘ └────┬─────┘      │             │                     │
│                         │       collections        │                     │
│                         │            │             │                     │
│                         │            ▼             │                     │
│                         │      ┌──────────┐        │                     │
│                         │      │COLLECTION│        │                     │
│                         │      └────┬─────┘        │                     │
│                         │           │              │                     │
│                         │      settled/written_off │                     │
│                         │           │              │                     │
│                         └───────────┼──────────────┘                     │
│                                     │                                     │
│                                     ▼                                     │
│                               ┌──────────┐                                │
│                               │   PAID   │                                │
│                               └──────────┘                                │
│                                                                              │
│  PAYMENT TYPES: rent, deposit, late_fee, maintenance, utility, other      │
│  PAYMENT METHODS: bank_transfer, credit_card, check, cash, auto_pay       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Translation Bundle State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TRANSLATION BUNDLE STATE MACHINE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Translation bundles are pre-computed JSON caches for fast loading.         │
│  They need to be regenerated when translations change.                      │
│                                                                              │
│  ┌──────────┐     locale_created    ┌──────────┐                           │
│  │  (none)  │ ─────────────────────►│  EMPTY   │                           │
│  └──────────┘                       │(no trans)│                           │
│                                     └────┬─────┘                           │
│                                          │ add_translations                │
│                                          ▼                                 │
│                                    ┌──────────┐                            │
│                                    │  STALE   │◄────────────────────┐      │
│                                    │(outdated)│                     │      │
│                                    └────┬─────┘                     │      │
│                                         │ regenerate                │      │
│                                         ▼                           │      │
│                                   ┌──────────┐                      │      │
│                                   │GENERATING│                      │      │
│                                   └────┬─────┘                      │      │
│                              ┌─────────┼─────────┐                  │      │
│                              │         │         │                  │      │
│                           failed    success    timeout              │      │
│                              │         │         │                  │      │
│                              ▼         ▼         │                  │      │
│                        ┌──────────┐ ┌──────────┐ │                  │      │
│                        │  ERROR   │ │ CURRENT  │ │                  │      │
│                        └────┬─────┘ └────┬─────┘ │                  │      │
│                             │            │       │                  │      │
│                          retry      translations_changed            │      │
│                             │            │       │                  │      │
│                             └────────────┴───────┴──────────────────┘      │
│                                                                              │
│  BUNDLE TYPES:                                                             │
│  ├── ui         - Static UI strings (buttons, labels)                     │
│  ├── schema     - Table/column labels for forms                           │
│  ├── enum       - Enum value display names                                │
│  └── content    - Dynamic user-generated content                          │
│                                                                              │
│  CACHE VALIDATION: content_hash comparison for cache-busting              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Feature Flag Rollout State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FEATURE FLAG ROLLOUT STATE MACHINE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐     create       ┌──────────┐                                │
│  │  (none)  │ ────────────────►│ DISABLED │                                │
│  └──────────┘                  │   (0%)   │                                │
│                                └────┬─────┘                                │
│                                     │ enable_for_testing                   │
│                                     ▼                                      │
│                               ┌──────────┐                                 │
│                               │ INTERNAL │                                 │
│                               │  ONLY    │ (staff + whitelisted orgs)     │
│                               └────┬─────┘                                 │
│                                    │ start_rollout                         │
│                                    ▼                                       │
│                              ┌──────────┐                                  │
│                              │ CANARY   │ (1-5% random users)             │
│                              └────┬─────┘                                  │
│                     ┌─────────────┼─────────────┐                          │
│                     │             │             │                          │
│                  issues      no_issues      abort                          │
│                     │             │             │                          │
│                     ▼             ▼             ▼                          │
│               ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│               │ ROLLBACK │  │  BETA    │  │ DISABLED │                    │
│               └────┬─────┘  │ (25-50%) │  └──────────┘                    │
│                    │        └────┬─────┘                                  │
│                    │             │ expand                                  │
│                    │             ▼                                         │
│                    │       ┌──────────┐                                    │
│                    │       │  GRADUAL │ (50-90%)                          │
│                    │       └────┬─────┘                                    │
│                    │             │ full_release                            │
│                    │             ▼                                         │
│                    │       ┌──────────┐                                    │
│                    │       │ ENABLED  │ (100%)                            │
│                    │       │  (GA)    │                                    │
│                    │       └────┬─────┘                                    │
│                    │             │ deprecate                               │
│                    │             ▼                                         │
│                    │       ┌──────────┐                                    │
│                    │       │ DEFAULT  │ (flag removable)                  │
│                    │       └────┬─────┘                                    │
│                    │             │ cleanup                                 │
│                    └─────────────┴───────┐                                 │
│                                          ▼                                 │
│                                    ┌──────────┐                            │
│                                    │ ARCHIVED │                            │
│                                    └──────────┘                            │
│                                                                              │
│  TARGETING OPTIONS:                                                        │
│  ├── org_whitelist[]     - Specific orgs always see feature               │
│  ├── org_blacklist[]     - Specific orgs never see feature                │
│  ├── app_whitelist[]     - Specific apps only                             │
│  ├── rollout_percentage  - Percentage-based random rollout                │
│  └── user_attributes     - Target by user properties                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Profile Onboarding State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PROFILE ONBOARDING STATE MACHINE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐   auth.signup     ┌──────────┐                               │
│  │  (none)  │ ─────────────────►│  CREATED │                               │
│  └──────────┘                   │(minimal) │                               │
│                                 └────┬─────┘                               │
│                                      │ start_onboarding                    │
│                                      ▼                                     │
│                                ┌──────────┐                                │
│                                │ PERSONAL │                                │
│                                │   INFO   │                                │
│                                └────┬─────┘                                │
│                                     │ name, dob, phone                     │
│                                     ▼                                      │
│                                ┌──────────┐                                │
│                                │ CONTACT  │                                │
│                                │ ADDRESS  │                                │
│                                └────┬─────┘                                │
│                                     │ address, locale, timezone            │
│                                     ▼                                      │
│                                ┌──────────┐                                │
│                                │PROFESSION│ (optional based on app)       │
│                                │   INFO   │                                │
│                                └────┬─────┘                                │
│                                     │ company, title, industry             │
│                                     ▼                                      │
│                                ┌──────────┐                                │
│                                │  AVATAR  │ (optional)                     │
│                                │  UPLOAD  │                                │
│                                └────┬─────┘                                │
│                       ┌─────────────┼─────────────┐                        │
│                       │             │             │                        │
│                    upload         skip        later                        │
│                       │             │             │                        │
│                       └─────────────┼─────────────┘                        │
│                                     │                                      │
│                                     ▼                                      │
│                                ┌──────────┐                                │
│                                │ COMPLETE │                                │
│                                └────┬─────┘                                │
│                                     │ redirect to app                      │
│                                     ▼                                      │
│                                ┌──────────┐                                │
│                                │  ACTIVE  │                                │
│                                └──────────┘                                │
│                                                                              │
│  SKIP BEHAVIOR:                                                            │
│  • User can skip optional steps                                            │
│  • Profile marked as "incomplete" until all required fields filled         │
│  • Periodic reminder to complete profile                                   │
│                                                                              │
│  FIELDS BY STEP:                                                           │
│  1. Personal: first_name*, last_name*, display_name, date_of_birth, gender│
│  2. Contact: phone*, address, preferred_locale*, timezone*                 │
│  3. Professional: company_name, job_title, industry (app-dependent)       │
│  4. Avatar: avatar_url (optional)                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Subscription State Machine (Per-App-Per-Org)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SUBSCRIPTION STATE MACHINE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Subscriptions are PER ORG PER APP                                         │
│  (org_id, app_id) → subscription                                           │
│                                                                              │
│  ┌──────────┐     add_app      ┌──────────┐                                │
│  │  (none)  │ ────────────────►│  TRIAL   │                                │
│  └──────────┘                  │ (14 days)│                                │
│                                └────┬─────┘                                │
│                      ┌──────────────┼──────────────┐                        │
│                      │              │              │                        │
│                 subscribe     trial_expired    cancel                       │
│                      │              │              │                        │
│                      ▼              ▼              ▼                        │
│               ┌──────────┐   ┌──────────┐   ┌──────────┐                   │
│               │  ACTIVE  │   │ EXPIRED  │   │ CANCELED │                   │
│               └────┬─────┘   └────┬─────┘   └──────────┘                   │
│                    │              │                                         │
│         ┌──────────┼──────────┐   │                                         │
│         │          │          │   │ reactivate                              │
│    upgrade    downgrade  payment_failed                                     │
│         │          │          │   │                                         │
│         ▼          ▼          ▼   │                                         │
│    ┌──────────┐  [ACTIVE]  ┌──────────┐                                    │
│    │ UPGRADED │            │ PAST_DUE │                                    │
│    │(new plan)│            └────┬─────┘                                    │
│    └──────────┘                 │                                          │
│                      ┌──────────┼──────────┐                                │
│                      │          │          │                                │
│                 payment_ok  grace_expired  cancel                           │
│                      │          │          │                                │
│                      ▼          ▼          ▼                                │
│               ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│               │  ACTIVE  │ │ SUSPENDED│ │ CANCELED │                       │
│               └──────────┘ └────┬─────┘ └──────────┘                       │
│                                 │                                           │
│                            reactivate                                       │
│                                 │                                           │
│                                 ▼                                           │
│                            ┌──────────┐                                     │
│                            │  ACTIVE  │                                     │
│                            └──────────┘                                     │
│                                                                              │
│  PLANS: free, basic ($10/mo), professional ($25/mo), enterprise (custom)  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```
