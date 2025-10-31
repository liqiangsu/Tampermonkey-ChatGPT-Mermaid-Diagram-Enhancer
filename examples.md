# Mermaid Diagram Examples

This file contains example Mermaid diagrams you can use to test the ChatGPT Mermaid Enhancer script.

## Basic Flowchart

```mermaid
flowchart TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant ChatGPT
    participant Script
    participant Mermaid

    User->>ChatGPT: Ask for diagram
    ChatGPT->>User: Returns mermaid code
    Script->>Script: Detects mermaid block
    Script->>User: Shows "View Diagram" button
    User->>Script: Clicks button
    Script->>Mermaid: Renders diagram
    Mermaid->>User: Displays diagram
```

## Class Diagram

```mermaid
classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    
    class ChatGPTEnhancer {
        +detectMermaid()
        +addButton()
        +showModal()
        +renderDiagram()
    }
    
    class MermaidRenderer {
        +initialize()
        +render()
        +validate()
    }
    
    User --> ChatGPTEnhancer: uses
    ChatGPTEnhancer --> MermaidRenderer: uses
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Detecting: Page loads
    Detecting --> ButtonAdded: Mermaid found
    Detecting --> Idle: No mermaid
    ButtonAdded --> ModalOpen: Button clicked
    ModalOpen --> Rendering: Initialize
    Rendering --> Success: Diagram rendered
    Rendering --> Error: Invalid syntax
    Success --> Idle: Modal closed
    Error --> Idle: Modal closed
```

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    PRODUCT ||--o{ LINE-ITEM : includes
    
    USER {
        string id
        string name
        string email
    }
    
    ORDER {
        string id
        datetime created_date
        string status
    }
    
    PRODUCT {
        string id
        string name
        decimal price
    }
```

## Simple Pie Chart

```mermaid
pie title Browser Usage
    "Chrome" : 60
    "Firefox" : 25
    "Safari" : 10
    "Edge" : 5
```

## Git Graph

```mermaid
gitgraph
    commit
    commit
    branch develop
    commit
    commit
    checkout main
    commit
    merge develop
    commit
```

## User Journey

```mermaid
journey
    title Installing ChatGPT Mermaid Enhancer
    section Installation
      Install Tampermonkey: 5: User
      Find the script: 4: User
      Install script: 5: User
    section Usage
      Open ChatGPT: 5: User
      Ask for diagram: 5: User
      Click view button: 5: User
      Enjoy diagram: 5: User
```

## Mindmap

```mermaid
mindmap
  root((ChatGPT Enhancer))
    Features
      Auto Detection
      Button Creation
      Modal Display
      Error Handling
    Technologies
      Tampermonkey
      Mermaid.js
      JavaScript
      CSS
    Benefits
      Better Visualization
      Enhanced UX
      Real-time Updates
```

## Simple Timeline

```mermaid
timeline
    title ChatGPT Mermaid Enhancer Development
    
    2024-10-30 : Planning
               : Research
    
    2024-10-31 : Development
               : Testing
               : Documentation
               : Release
```

---

## How to Test

1. Copy any of the above examples
2. Paste them into ChatGPT and ask ChatGPT to create a similar diagram
3. Look for the "📊 View Diagram" button next to the code block
4. Click the button to see the rendered diagram

## Pro Tips

- Ask ChatGPT to explain the diagram syntax
- Request modifications to existing diagrams
- Combine multiple diagram types in one conversation
- Use descriptive titles and labels for clarity