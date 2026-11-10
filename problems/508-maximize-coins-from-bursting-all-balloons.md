# Maximize Coins from Bursting All Balloons
> Google · Other · hard · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/maximize-coins-from-bursting-all-balloons

### Problem

Burst every balloon in some order. Bursting one earns its value times the values of its currently adjacent surviving neighbors; a missing outer neighbor contributes 1. Return the greatest total coins.

```cpp
int maxCoins(vector<int>& nums);
```

### Examples

```text
nums = [2,4] -> 12
nums = [0,3] -> 3
```

### Constraints

- There are 1 through 300 balloons.
- Values lie in [0,100].
