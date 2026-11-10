# Buy Exact Item Quantities Using Reusable Bundles
> Google · Other · medium · Pattern: Dynamic Programming, Backtracking
> Source: https://prachub.com/interview-questions/buy-exact-item-quantities-using-reusable-bundles

### Problem

price[i] is the unit price of item i, needs[i] is its required quantity, and each special row contains item quantities followed by the bundle price. Return the minimum cost to purchase exactly needs. Offers can be used repeatedly, but buying extra items is forbidden.

```cpp
class Solution {
public:
    int shoppingOffers(vector<int>& price, vector<vector<int>>& special, vector<int>& needs);
};
```

### Examples

**Example 1:**

```text
price = [3,4], special = [[1,1,5]], needs = [2,1]
Output: 8
Explanation: One bundle and one unit of item zero cost 5+3.
```

**Example 2:**

```text
price = [2], special = [[3,4]], needs = [2]
Output: 4
Explanation: The cheaper-per-unit bundle would overbuy and is forbidden.
```

### Constraints

- The item count n is both array lengths price and needs and is in 1..6. Unit prices and required quantities are in 0..10. There are 1..100 special rows, each with n+1 entries, all in 0..50. Every offer contains a positive quantity of at least one item.

### Clarifying Questions

Enforce exact quantities and allow repeated offers while ensuring every recursive transition reduces remaining needs.

```hint Read the boundary condition
What state remains after a bundle that does not exceed any requested quantity?
```

### Contract considerations

Enforce exact quantities and allow repeated offers while ensuring every recursive transition reduces remaining needs.
