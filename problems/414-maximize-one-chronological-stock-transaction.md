# Maximize One Chronological Stock Transaction
> Google · Other · easy · Pattern: Greedy
> Source: https://prachub.com/interview-questions/maximize-one-chronological-stock-transaction

### Problem

Choose one day to buy one share and a later, different day to sell it. Given daily prices in chronological order, return the largest achievable profit from this single transaction. Return 0 if no profitable transaction exists; making no transaction is allowed.

```cpp
int maxProfit(vector<int>& prices);
```

### Examples

```text
Input: prices = [9,2,8,1,6]
Output: 6
```

Buying at 2 and later selling at 8 yields 6. The later price 1 cannot be paired with the earlier price 8 as a sale.

```text
Input: prices = [6,4,4,1]
Output: 0
```

### Constraints

- The number of days is between 1 and 100000.
- Every price is between 0 and 10000, inclusive.
