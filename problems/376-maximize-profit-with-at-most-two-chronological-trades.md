# Maximize Profit with at Most Two Chronological Trades
> Google · Other · hard · Pattern: Intervals / Sweep Line, Dynamic Programming
> Source: https://prachub.com/interview-questions/maximize-profit-with-at-most-two-chronological-trades

### Problem

Given chronological stock prices, return the greatest profit obtainable with at most two completed buy/sell transactions. Hold at most one share: sell a purchased share before buying another. Choosing no transaction is allowed.

```cpp
int maxProfit(vector<int>& prices);
```

### Examples

```text
Input: prices = [8,2,7,1,6]
Output: 10
```

Buy at 2 and sell at 7, then buy at 1 and sell at 6.

```text
Input: prices = [9,5,3]
Output: 0
```

### Constraints

- There are between 1 and 100000 prices.
- Each price is between 0 and 100000, inclusive.
- At most two transactions may be completed; transactions cannot overlap.
