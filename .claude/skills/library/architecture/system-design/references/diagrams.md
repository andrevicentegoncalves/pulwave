# Architecture Diagrams

## The C4 Model

Visualizing software architecture specifically for different audiences.

### Level 1: System Context
**Audience**: Non-technical stakeholders, Product Owners.
**Shows**: The system in the center, and the users/external systems touching it.
**Example (Mermaid)**:
```mermaid
C4Context
  title System Context diagram for Internet Banking System
  
  Person(customer, "Banking Customer", "A customer of the bank.")
  System(banking_system, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments.")
  System_Ext(mail_system, "E-mail System", "The internal Microsoft Exchange e-mail system.")
  System_Ext(mainframe, "Mainframe Banking System", "Stores all of the core banking information.")

  Rel(customer, banking_system, "Uses")
  Rel(banking_system, mail_system, "Sends e-mails", "SMTP")
  Rel(banking_system, mainframe, "Uses")
  Rel(mail_system, customer, "Sends e-mails to")
```

### Level 2: Container
**Audience**: Architects, Developers, Ops.
**Shows**: Deployable units (Mobile App, API, Database, SPA).
**Example (Mermaid)**:
```mermaid
C4Container
  title Container diagram for Internet Banking System

  Person(customer, "Customer", "A customer of the bank.")
  
  Container_Boundary(c1, "Internet Banking") {
    Container(spa, "Single Page App", "JavaScript/React", "Provides function to customers via web browser")
    Container(mobile_app, "Mobile App", "Xamarin/C#", "Provides function to customers via mobile")
    Container(api, "API Application", "Java/Spring MVC", "Provides functionality via JSON/HTTPS API")
    ContainerDb(database, "Database", "Oracle/SQL", "Stores user registration information, hashed auth credentials, access logs, etc.")
  }

  Rel(customer, spa, "Uses", "HTTPS")
  Rel(customer, mobile_app, "Uses")
  Rel(spa, api, "Uses", "JSON/HTTPS")
  Rel(mobile_app, api, "Uses", "JSON/HTTPS")
  Rel(api, database, "Reads from and writes to", "JDBC")
```

### Level 3: Component
**Audience**: Developers.
**Shows**: Internal structure of one container (e.g., API classes/modules).

## Sequence Diagrams

**Use for**: showing strict order of operations, especially across network calls.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as DB
    
    U->>F: Click Login
    F->>A: POST /login
    A->>D: Find User
    D-->>A: User Data
    A->>A: Verify Hash
    A-->>F: 200 OK + Token
    F-->>U: Redirect to Dashboard
```

## State Diagrams

**Use for**: Complex lifecycles (e.g., Order Status, Payment Flow).

```mermaid
stateDiagram-v2
    [*] --> New
    New --> Processing: Payment Success
    New --> Failed: Payment Failed
    Processing --> Shipped
    Shipped --> Delivered
    Delivered --> [*]
```
