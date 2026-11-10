# Implement Checksums and Feature Rollout Evaluation
> Google · Online Assessment · medium · Pattern: String Processing, Topological Sort, Stack / Parsing
> Source: https://prachub.com/interview-questions/implement-checksums-and-feature-rollout-evaluation

Complete the following two coding tasks in a 90-minute online assessment. An AI coding assistant may be available, but the submitted code must pass the provided unit tests.

## Task 1: Build an email verification string

Implement a function such as `buildVerificationString(email, verification, k)`.

You are given:
- `email`: a string containing only lowercase letters and the characters `:`, `/`, and `.`.
- `verification`: a non-empty string used as a lookup table.
- `k`: a positive integer chunk size.

Use the following character weights:
- `a = 1, b = 2, ..., z = 26`
- `: = 27`
- `/ = 28`
- `. = 29`

Process `email` from left to right in consecutive chunks of size `k`. The final chunk may contain fewer than `k` characters. For each chunk:
1. Compute its checksum as the sum of the weights of its characters.
2. Convert the checksum to an index using `checksum % verification.length`, with zero-based indexing.
3. Append `verification[index]` to the answer.

Return the concatenation of all selected verification characters.

## Task 2: Evaluate a feature rollout with dependencies

Implement or repair a feature rollout evaluator for deciding whether a user should receive a new feature.

You are given existing model classes similar to:

- `User`
  - `country`
  - `platform`, either `android` or `ios`
  - `version`, an integer version for that platform
  - `enabledFeatures`, the set of features already enabled for the user

- `FeatureRule`
  - `allowedCountries`, a set of countries in which the feature may be enabled
  - `minAndroidVersion`
  - `minIosVersion`

- `ResultDecision`
  - `enabled`: boolean
  - `reason`: string explaining the decision

You are also given:
- `targetFeature`: the feature being evaluated.
- `rolloutFeatures`: the set of features being rolled out in this batch.
- A dependency text file describing feature dependencies.
- A parser skeleton and an `evaluate` function skeleton that contain bugs.

### Required evaluation order

For `targetFeature`, check the following in order:

1. Country eligibility.
   - If the user's country is not allowed, the result must be `enabled = false` with a country-specific rejection reason.

2. Platform version eligibility.
   - If the user is on Android, their version must be at least `minAndroidVersion`.
   - If the user is on iOS, their version must be at least `minIosVersion`.
   - If the platform/version check fails, return `enabled = false` with a platform-specific rejection reason.

3. Combined rejection.
   - If both country and platform checks fail, return a special combined country-and-platform rejection reason, rather than returning only one of the two individual reasons.

4. Dependency checks.
   - Dependency checks must happen only after the country and platform checks pass.
   - If country or platform eligibility fails, do not inspect or evaluate dependencies.

Use the provided sets and helper data structures for allowed countries and supported platforms. Do not replace them with hard-coded values that may differ from the tests.

### Dependency file parsing

The dependency file contains one feature per line in a format such as:

`featureName: dependencyA, dependencyB, dependencyC`

Rules:
- Empty dependency lists are allowed.
- Whitespace around feature names and dependency names should be ignored.
- Multiple dependencies must be parsed as separate strings, not as one combined string.

For example, the line:

`checkout: login, payments`

must parse as:

`checkout -> [login, payments]`

not:

`checkout -> ["login, payments"]`.

### Dependency evaluation rules

A dependency is satisfied if either:
- It is already in `user.enabledFeatures`, or
- It is included in `rolloutFeatures` and all of its own dependencies can also be satisfied during this rollout batch.

A dependency is missing if it is neither already enabled nor present in `rolloutFeatures`. In that case, return `enabled = false` with a missing-dependency reason that identifies the missing feature.

Your implementation must handle at least the following cases:

1. A feature with exactly one dependency.
2. A feature whose dependency is also being rolled out in the same batch.
3. A simple two-feature cycle, such as `A -> B` and `B -> A`.
4. A feature that depends on another feature that is part of a cycle.
5. A longer cycle, such as `A -> B -> C -> D -> A`, while correctly identifying the first repeated feature in the current recursion path.
6. A longer cycle while listing every feature involved in the cycle in the rejection reason.

For a detected cycle, return `enabled = false` with a cycle reason such as:

`CYCLE: A -> B -> C -> D -> A`

where the listed features correspond to the cycle found in the current dependency traversal.

If all country, platform, and dependency checks pass, return `enabled = true` with a success reason such as `ENABLED`.

<details><summary>Hints (spoiler)</summary>

1. Create a helper that maps each allowed character to its weight.
2. Process the string in steps of k using a loop like range(0, len(email), k).
</details>
