# Maximize Repeated One-Share Stock Trading Profit
> Google · Other · medium · Pattern: Greedy
> Source: https://prachub.com/interview-questions/maximize-repeated-one-share-stock-trading-profit

### Problem

Find the maximum total profit from trading one stock across the daily prices. You may make as many purchases and sales as useful, but may hold at most one share at any moment. Buying and selling, including repeated sell/buy operations, are allowed on the same day while respecting that holding limit. You may also make no transactions.

```cpp
int maxProfit(vector<int>& prices);
```

Return the maximum profit, rather than a transaction schedule.

### Examples

```text
Input: prices = [9,2,8,1,6]
Output: 11
```

Buy at 2 and sell at 8, then buy at 1 and sell at 6: profits 6 and 5.

```text
Input: prices = [2,4,7,7,9]
Output: 7
```

Holding from price 2 to price 9 achieves the same profit as collecting its positive daily increases.

### Constraints

- There are between 1 and 30000 daily prices.
- Every price lies between 0 and 10000, inclusive.
- Never hold more than one share, including during same-day operations.
