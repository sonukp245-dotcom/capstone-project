# AI-Assisted Development Workflow

## Overview

For this workflow drill, I built the same capstone-relevant user settings feature twice. The first version used a broad, less structured request, while the second version used a precise prompt with explicit requirements, validation rules, accessibility expectations, and testing criteria. The goal was to compare how prompt quality affects implementation quality and review effort.

## V1: Vague Prompt

The first version was created using a general request to build a user settings form with validation. The resulting feature included fields for display name, email, theme, email notifications, password, and password confirmation. It also included validation messages and localStorage support.

V1 was functional, but the requirements were not fully specified before implementation. This meant that some expected behaviour and accessibility details were not explicitly defined in the original request.

## V2: Precise Prompt

For V2, I wrote a structured prompt before implementation. It specified the required fields, validation rules, responsive behaviour, accessibility requirements, testing scenarios, and a constraint to avoid unrelated file changes.

The precise prompt produced a more intentional implementation. The HTML was improved with labels, required attributes, ARIA descriptions, `aria-invalid`, and live regions for feedback. The JavaScript validation was also structured to return a predictable result containing `isValid`, `errors`, and normalized values. Invalid submissions focus the first invalid field, improving keyboard accessibility.

## Testing and Review

The existing settings validation tests were executed directly with Node because the repository did not contain a package.json or npm test script. The final V2 implementation passed all seven validation checks:

* Empty submission
* Short display name
* Invalid email
* Short password
* Password mismatch
* Valid submission without password
* Valid submission with matching password

The final result was `All settings validation checks passed.`

## What I Learned

The main lesson from this workflow was that precise prompting reduces ambiguity and makes implementation easier to evaluate. A useful prompt should define the goal, constraints, edge cases, accessibility expectations, and tests rather than only describing the desired feature.

I also learned that AI-generated code still requires independent verification. The V2 implementation initially exposed a mismatch between the implementation and the existing test expectation for the settings storage key. I identified the failing assertion, corrected the implementation, and reran the tests successfully.

Going forward, I will use a plan → implement → test → review workflow rather than accepting generated code without verification.
