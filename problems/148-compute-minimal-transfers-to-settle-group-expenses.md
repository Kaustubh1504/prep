# Compute minimal transfers to settle group expenses
> Google · Technical Screen · medium · Pattern: Greedy, Sorting, Backtracking
> Source: https://prachub.com/interview-questions/compute-minimal-transfers-to-settle-group-expenses

## Problem
A group of friends go on a trip and share expenses. Each expense is recorded as an object:

- `payer` (string): who paid the full amount
- `amount` (integer): total amount paid (assume in cents to avoid floating point)
- `payees` (string[]): the friends who should share this expense **equally**

Each payee owes an equal share of that expense. The payer may also appear in `payees` (meaning they also consume/share the expense).

### Task
Given an array of such expenses, compute a set of **money transfers between friends** that settles all debts:

- After applying your transfers, every person’s net balance becomes 0 (no one owes/is owed).
- The transfers should be **minimal** in the sense of using the **fewest number of payments/transactions** possible.
- If multiple minimal answers exist, returning any one is acceptable.

### Output format
Return an array of transfer objects:

- `payer`: the person who sends money (the debtor)
- `amount`: the amount sent (integer, in cents)
- `payees`: an array containing exactly **one** person who receives the money (the creditor)

Example transfer: `{ payer: "bob", amount: 1000, payees: ["alice"] }` meaning “bob pays alice 1000 cents”.

### Example
**Input**
```js
[
  { payer: 'alice', amount: 4000, payees: ['bob', 'jess', 'alice', 'sam'] },
  { payer: 'jess', amount: 2000, payees: ['jess', 'alice'] }
]
```

**Output (one valid minimal answer)**
```js
[
  { payer: 'bob', amount: 1000, payees: ['alice'] },
  { payer: 'sam', amount: 1000, payees: ['alice'] }
]
```

### Notes / Constraints
- `amount` is divisible by `payees.length` (so equal splitting is exact).
- Names are case-sensitive strings.
- You may assume the input size is large enough that an efficient solution is expected.

<details><summary>Hints (spoiler)</summary>

1. First reduce every expense to a single net balance per person (in cents): a payer gains the full amount, and every payee loses amount / len(payees).
2. People with a positive balance are creditors (owed money); people with a negative balance are debtors (owe money). People with zero balance need no transfer.
3. Sort debtors and creditors lexicographically by name to make the result deterministic, then greedily transfer min(remaining_debt, remaining_credit) between the current debtor and creditor, advancing whichever side reaches zero.
</details>
