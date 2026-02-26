<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. High-Performance Modular Code
  - [PRINCIPLE_2_NAME] → II. Responsive UX Consistency
  - [PRINCIPLE_3_NAME] → III. Robust Data Validation (WhatsApp Checkout)
  - [PRINCIPLE_4_NAME] → IV. Scalable Backend Architecture
- Removed sections: [PRINCIPLE_5_NAME]
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (⚠ no changes required)
  - .specify/templates/tasks-template.md (⚠ no changes required)
- Follow-up TODOs: None
-->

# ItalyaOils Constitution

## Core Principles

### I. High-Performance Modular Code

All code MUST be organized into cohesive, self-contained modules. Components SHOULD be optimized for performance, minimizing unnecessary resource consumption and ensuring fast parsing and execution.

### II. Responsive UX Consistency

The user interface MUST strictly preserve the provided HTML UI designs. All styling and layout updates MUST seamlessly support responsive behaviors across mobile, tablet, and desktop viewports without degrading the established aesthetics.

### III. Robust Data Validation (WhatsApp Checkout)

The WhatsApp checkout flow is a critical conversion path. All user inputs MUST be rigorously validated on the client side before submission. Validation logic MUST ensure data completeness and proper formatting to prevent broken or malformed checkout messages.

### IV. Scalable Backend Architecture

Backend services MUST be designed to handle bulk data operations efficiently. The architecture MUST support dynamic content injection, ensuring that as data scales, system responsiveness and stability are maintained.

## Technology Stack & Standards

- **Frontend**: HTML/CSS/JS (Vanilla or selected framework, preserving original HTML UI).
- **Backend**: Architecture capable of bulk data operations and dynamic injection.
- **Integration**: WhatsApp API or similar for checkout.

## Development Workflow

- **Code Review**: All changes MUST be reviewed for adherence to these principles.
- **Testing**: Validation logic MUST be tested rigorously before deployment.

## Governance

Amendments to these principles require documentation and must not conflict with the core goals of ItalyaOils. All PRs/reviews must verify compliance with the principles above.

**Version**: 1.0.0 | **Ratified**: 2026-02-26 | **Last Amended**: 2026-02-26
