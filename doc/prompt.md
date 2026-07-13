# Prompts
## Explore and map web application
- The purpose of this step is to explore the following pages and create a comprehensive and complete description of the web application that can be used as a reference for the next steps (e.g., user stories, test cases, automation)
  - https://demoqa.com/books
  - https://demoqa.com/register
  - https://demoqa.com/login
  - https://demoqa.com/profile
- The page /books has a Login button that routes the user to the /login page. In the Login page click the **New User** button to create a User and if the user is created successfully, then get back to the /login page to sign in. If a recaptcha required message is displayed then login using the following crdentials (username/password):  csilva/Testing1!
- After signing in, the user should be redirected to the /profile page
- Continue the exploration of the /profile page to complete the System Blueprint document.
- Use @playwright/mcp to interact with the application.
- Explore the different features of the application, behaviors, user interactions, data flow, and semantic meaning of each element.
- Don't click links pointing to external websites or outside the current application.
- After the proper analysis, dismiss any popups or notifications that appear.
- Identify what pages requires Sign In and what pages are public.
- Save the result in the ./doc/bookStore_SystemBlueprint.md file.
- Save a screenshot of every different page or state of the application.
- The document should include a summary table in the header with the following items: Page/State, Description, Screenshot
- The application has a swagger document at https://demoqa.com/swagger Identify the available endpoint for a further API Tests implementation. Add the result into a **Book Store API** section 

## Create Business Context
- **Purpose:** Describe the business domain, users, goals, and constraints of the DemoQA Book Store application.
- **Input:** Use only the findings documented in ./doc/bookStore_SystemBlueprint.md.
- **Output:** Create ./doc/bookStore_BusinessContext.md.
- **Required sections:**
  - Business Overview (what the app does, who uses it, business value)
  - Stakeholders & Users (roles like visitor, registered user, admin)
  - Scope Boundaries (in-scope / out-of-scope features)
  - Risk Analysis (identify risks that could affect user stories and test priorities)
- **Risk Analysis requirements:**
  - For each risk, include: Risk, Likelihood, Impact, Mitigation, Owner (if known)
  - Cover at least: authentication gaps, shared demo environment, reCAPTCHA blocking automation, data volatility, external ad interference, API contract drift

## Create User Stories
- **Purpose:** Create a set of User Stories for the DemoQA Book Store application.
- **Input:** Derive stories only from bookStore_SystemBlueprint.md and bookStore_BusinessContext.md
- **Output:** Create `./doc/bookStore_UserStories.md`.
- **Excluded scope:** Do not create user stories for the Swagger API contract documentation.
- **Format:** For each story use:
  - `ID` (e.g., US-001)
  - `As a <user role>, I want <goal>, so that <benefit>`
  - `Acceptance Criteria` (2–5 bullet points)
  - `Priority` (High / Medium / Low) and a one-line justification based on business context
  - `Traceability` (e.g., links to relevant System Blueprint section and Business Context risk)
- **Grouping:** Organize stories by feature area: Catalog, Authentication, Profile / Collection.
- **INVEST compliance:** Each story must be Independent, Negotiable, Valuable, Estimable, Small, Testable. If a story is too broad, split it.
- **Assumptions:** Add a final "Open Assumptions" section listing any missing business rules that need stakeholder input.

## Create Test Cases
- **Purpose:** Create a set of Test Cases derived from the user stories in bookStore_UserStories.md
- **Output:** Create `./doc/bookStore_TestCases.md`.
- **Structure:** For each test case include:
  - `Test Case ID` (e.g., TC-001)
  - `Title` (short summary)
  - `Description` (what is being validated)
  - `Trace to User Story` (e.g., US-001)
  - `Priority` (High / Medium / Low), aligned with the source user story
  - `Type` (UI / API)
  - `Can be Automated` (Yes / No)
  - `Preconditions` (required state, e.g., user is logged out, a test user exists)
  - `Test Data` (inputs such as username, ISBN, search term)
  - `Steps` (numbered; each step may include its own expected result)
  - `Expected Result` (overall expected outcome)
  - `Teardown` (cleanup needed to avoid data collisions in the shared demo environment)
- **Coverage guidance:**
  - Include at least one positive test per acceptance criterion.
  - Include negative tests for registration, login, and add/delete collection actions.
  - Mark tests that require API setup due to reCAPTCHA as `Type: API` for setup and `Type: UI` for validation where applicable.
- **Grouping:** Group test cases by feature area: Catalog, Authentication, Profile / Collection.
- **Traceability:** Each test case must map back to exactly one user story ID for validation reporting.

## Create Non-Deterministic User Stories, Test Cases, and Fixtures
- The purpose of this step is to cover the "non-deterministic tests for relevance, consistency, and hallucination risk" area named in the README's Suggested testing scope, since the app's replies come from a local LLM (Ollama) and cannot be asserted with exact/binary checks.
- Treat this as fully independent from the deterministic User Stories and Test Cases (different files, different ID namespace, different pass/fail semantics). Do not merge into `chatBot_UserStories.md` / `chatBot_TestCases.md`.
- Judgment method: embedding cosine similarity computed in-process via `@huggingface/transformers` (Transformers.js), using the `onnx-community/all-MiniLM-L6-v2-ONNX` embedding model (384-dim, `feature-extraction` pipeline). Do not use a second judge LLM.
- Relevance: for each prompt in a golden set, compute cosine similarity between the bot's reply and a pre-approved reference answer. Pass threshold: similarity >= 0.8.
- Consistency: pick one prompt per golden-set category (5 total), run each 5 times, compute all `C(5,2)=10` pairwise similarity comparisons between the 5 replies. Pass only if all 10 comparisons are >= 0.8.
- Golden set size: 10 prompts total, 2 per category, across 5 categories (greeting, factual/definitional, instructional/how-to, edge case, long/complex).
- Hallucination risk: do NOT use embedding similarity for this (it can't distinguish a confidently wrong answer from a correct paraphrase). Use two prompt lists instead:
  - Verifiable-fact prompts (5): each has a short, objectively correct answer; pass if the reply matches a case-insensitive regex allowing 1-2 accepted synonyms per fact.
  - Fabricated-entity prompts (5): ask about an entity/API that does not exist; pass if the reply contains a phrase from a shared hedge/uncertainty pattern (e.g. "not aware", "doesn't exist", "not sure").
- ID scheme: `US-ND-01`, `US-ND-02`, ... for stories; `TC-ND-01`, `TC-ND-02`, ... for test cases.
- Test Cases format: Gherkin (`Feature`/`Scenario Outline`/`Examples`), tagged with `@TC-ND-xx`, `@US-ND-xx`, `@priority-*`, `@type-nondeterministic`, and `@metric-(relevance|consistency|hallucination)`. Group scenarios by metric (relevance / consistency / hallucination), not by user story.
- Execution posture: these tests are advisory/tracked only — a failing scenario is recorded for visibility and must NOT block the pipeline. State this explicitly in both documents.
- Identify open assumptions or missing rules (e.g. fixture content not yet validated against real model output, hedge-phrase list coverage, embedding model version pinning, execution cadence).
- Save the results in:
  - ./doc/chatBot_UserStories_NonDeterministic.md
  - ./doc/chatBot_TestCases_NonDeterministic.md
  - ./tests/fixtures/golden-set.json (prompts, reference answers, category, `usedForConsistency` flag, similarity threshold)
  - ./tests/fixtures/hallucination-set.json (verifiableFact list with expectedPattern, fabricatedEntity list, shared hedgePhrasePattern)
- After generating/regenerating the fixtures, flag clearly that prompt/reference-answer/pattern content is a first draft and should be validated against real model output before being treated as final.

