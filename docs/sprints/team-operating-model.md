# Team Operating Model (Sub-agent Style)

## Objective
Run delivery with specialist roles while preserving quality, speed, and clear ownership.

## Role Responsibilities

### Marketing Specialist
Owns:
- Positioning and message-market fit
- Campaign and CTA optimization
- Content angles and trust storytelling

Outputs:
- Messaging briefs
- A/B test hypotheses
- Weekly conversion insight notes

### Business Analyst
Owns:
- KPI definition and business acceptance criteria
- Funnel metrics and lead quality framework
- Prioritization using business impact

Outputs:
- KPI dashboard requirements
- Lead scoring rubric
- Prioritized backlog recommendations

### Technical Functional Analyst
Owns:
- Functional specs and behavior rules
- Field-level and flow-level requirements
- Acceptance criteria for QA and engineering

Outputs:
- Functional requirement docs
- Error-state and edge-case matrices
- Traceability from business need to feature

### Full-Stack Developer Team
Owns:
- End-to-end implementation and testing
- Deployment, monitoring, and reliability
- Performance and accessibility compliance

Outputs:
- Working features
- Test artifacts
- Deployment and rollback notes

## Handoff Protocol
1. Marketing/BA define objectives and expected outcomes.
2. Functional analyst converts outcomes into testable specs.
3. Full-stack team estimates and implements.
4. QA verifies against acceptance criteria.
5. BA validates KPI instrumentation and business readiness.

## Cadence
- Daily async update (status, blockers, next action)
- Mid-sprint checkpoint (scope/quality risk review)
- End-sprint review (outcomes + data + decisions)

## Artifacts Required per Sprint
- Sprint goal and scope lock
- Risk log
- Acceptance criteria checklist
- KPI snapshot before/after sprint
- Final sprint retrospective and follow-up actions

## Quality Gates
1. Product gate: messaging clarity and conversion intent
2. Functional gate: requirements complete and testable
3. Engineering gate: tests passing + no critical regressions
4. Business gate: KPI events validated and operational workflow ready

## Escalation Rules
- If blocker exceeds 24h, escalate in same day.
- If KPI risk is high, reduce scope to protect release quality.
- If technical debt threatens launch, create explicit follow-up with owner/date.
