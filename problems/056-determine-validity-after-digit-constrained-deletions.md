# Determine validity after digit-constrained deletions
> Google · Onsite · medium · Pattern: Math / Number Theory, Stack / Parsing, Greedy
> Source: https://prachub.com/interview-questions/determine-validity-after-digit-constrained-deletions

# Determine validity after digit-constrained deletions

You're given a string S of length n consisting only of '(' , ')' , and digits '0'–'9'. For every digit at index i with numeric value v:
(
1) you must delete exactly v parentheses that occur at indices strictly less than i;
(
2) a given parenthesis can be deleted at most once across all digits;
(
3) digits themselves are not deleted and should be ignored when checking validity. After choosing deletions for all digits, consider the sequence of remaining parentheses (ignoring digits). Return true if there exists at least one choice of deletions such that the remaining parentheses form a valid parentheses string, otherwise return false. Also describe an efficient algorithm, its time and space complexity, and optionally output one valid witness set of deletions if it exists.

### Clarifying Questions to Ask
- Clarify input sizes, value ranges, mutability, return format, and tie-breaking.
- State the target time and space complexity before coding.
- Call out edge cases such as empty inputs, duplicates, invalid values, overflow, and boundary sizes.

### What a Strong Answer Covers
- A clear algorithm with the right data structures and enough pseudocode or code-level detail to implement it.
- A correctness argument that explains why the algorithm covers all required cases.
- Time and space complexity, plus at least one alternative approach when relevant.
- Focused tests for normal cases, edge cases, and failure modes.

### Follow-up Questions
- How would the approach change if the input were streaming or too large for memory?
- What invariants would you assert in production code?
- Which tests would catch off-by-one, duplicate, or tie-breaking bugs?
