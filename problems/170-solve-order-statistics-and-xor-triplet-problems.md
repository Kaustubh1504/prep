# Solve order-statistics and XOR-triplet problems
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Hard · Pattern: Bit Manipulation

## Problem
This is a two-part question. Part 1 asks for an order-statistics count similar to counting inversions. Part 2 counts triplets using prefix XORs. Both parts need a better solution than the brute force.

**Part 1: count smaller elements to the right.** Given an integer array `nums`, return an array `counts` where `counts[i]` is the number of indices `j > i` with `nums[j] < nums[i]`. The comparison is strict, so equal values are not counted. The sum of `counts` is the number of inversions in the array. The target is O(n log n).

**Part 2: XOR-equal triplets.** Given an array `arr` of positive integers, count the triplets `(i, j, k)` with `0 <= i < j <= k < n` such that
`a = arr[i] ^ arr[i+1] ^ ... ^ arr[j-1]` equals `b = arr[j] ^ arr[j+1] ^ ... ^ arr[k]`.
Here `^` is bitwise XOR. The target is O(n).

## Function signature
```python
def count_smaller(nums: list[int]) -> list[int]: ...          # Part 1
def count_xor_triplets(arr: list[int]) -> int: ...            # Part 2
```

## Constraints
- Part 1: `0 <= len(nums) <= 10^5`, `-10^9 <= nums[i] <= 10^9`
- Part 2: `0 <= len(arr) <= 10^5`, `1 <= arr[i] <= 10^8`; the answer can exceed 32 bits

## Examples
**Example 1** (Part 1)
Input: `nums = [5,2,6,1]`
Output: `[2,1,1,0]`
Explanation: To the right of 5 are 2 and 1, which are smaller. To the right of 2 is 1. To the right of 6 is 1. Nothing is to the right of 1.

**Example 2** (Part 1 edge cases: duplicates, empty array)
Input: `nums = [3,1,2,1]`
Output: `[3,0,1,0]`
Explanation: The second `1` is not smaller than the first `1`.

Input: `nums = [-1,-1]` gives `[0,0]`. Input: `nums = []` gives `[]`.

**Example 3** (Part 2)
Input: `arr = [2,3,1,6,7]`
Output: `4`
Explanation: The valid triplets are `(0,1,2)`, `(0,2,2)`, `(2,3,4)` and `(2,4,4)`.

Input: `arr = [1,1,1,1,1]`
Output: `10`

**Example 4** (Part 2 edge case)
Input: `arr = [7]`
Output: `0`

<details><summary>Approach (spoiler)</summary>

**Part 1:** compress the values to ranks, then scan from right to left with a Fenwick tree (BIT) that counts the values seen so far. For `nums[i]`, query the prefix count of ranks strictly below its rank, then insert it. A merge-sort that counts how many right-half elements move ahead of each left element also works.

**Part 2:** `a == b` exactly when `a ^ b == 0`, which means `P[i] == P[k+1]`, where `P` is the prefix-XOR array (`P[0] = 0`). The value of `j` doesn't matter, so each pair of prefix indices `p < q` with `P[p] == P[q]` gives `q - p - 1` triplets. To sum this in one pass, keep for each prefix value the number of times it has appeared and the sum of the indices where it appeared. At `q = k+1`, add `count * k - index_sum`.

**Time:** Part 1 O(n log n), Part 2 O(n) · **Space:** O(n)

```python
from collections import defaultdict

def count_smaller(nums):
    vals = sorted(set(nums))
    rank = {v: i + 1 for i, v in enumerate(vals)}
    m = len(vals)
    tree = [0] * (m + 1)
    res = [0] * len(nums)
    for i in range(len(nums) - 1, -1, -1):
        r, s = rank[nums[i]] - 1, 0
        while r > 0:
            s += tree[r]; r -= r & -r
        res[i] = s
        r = rank[nums[i]]
        while r <= m:
            tree[r] += 1; r += r & -r
    return res

def count_xor_triplets(arr):
    cnt, idx_sum = defaultdict(int), defaultdict(int)
    cnt[0] = 1                      # prefix index 0 has value 0
    pref = total = 0
    for k, x in enumerate(arr):
        pref ^= x                   # pref = P[k+1]
        total += cnt[pref] * k - idx_sum[pref]
        cnt[pref] += 1
        idx_sum[pref] += k + 1
    return total
```
</details>
