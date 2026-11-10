# Determine Whether the Last Array Index Is Reachable by Forward Jumps
> Google · Onsite · medium · Pattern: Greedy
> Source: https://prachub.com/interview-questions/determine-whether-the-last-array-index-is-reachable-by-forward-jumps

You are given a list of non-negative integers `nums` and start at index `0`. The value `nums[i]` is the longest jump you may make from index `i`: from `i` you may move forward to any index `j` with `i < j <= i + nums[i]`, as long as `j` is a valid index.

Return `True` if some sequence of jumps reaches the last index, `len(nums) - 1`, and `False` otherwise.

### Function Signature

```python
def can_reach_last_index(nums: list[int]) -> bool:
```

### Rules

- Jumps only move forward, and from index `i` you may choose any jump length from `1` up to `nums[i]`. A jump may not land beyond the last index, but any shorter jump is still allowed.
- A value of `0` means no jump can be made from that index.
- If `nums` has a single element, you are already at the last index, so the answer is `True`.

### Constraints

- `1 <= len(nums) <= 10^5`
- `0 <= nums[i] <= 10^5`

### Examples

**Example 1**

- Input: `nums = [1, 2, 0, 3, 0]`
- Output: `True`
- Explanation: Jump from index `0` to index `1`, then a jump of length 2 from index `1` to index `3`, then from index `3` to the last index, `4`.

**Example 2**

- Input: `nums = [3, 1, 1, 0, 2]`
- Output: `False`
- Explanation: Indices `1`, `2` and `3` are reachable, but every route ends at index `3`, whose value is `0`. Index `4` is never reached.

**Example 3**

- Input: `nums = [0]`
- Output: `True`
- Explanation: The start is already the last index.

<details><summary>Hints (spoiler)</summary>

1. You never need to know which exact path you took, only which indices are reachable at all.
2. If index i is reachable, is every index before i also reachable? What single number summarizes the reachable set?
3. Scan left to right and stop as soon as you reach an index that nothing before it can reach.
</details>

<details><summary>Approach (spoiler)</summary>

The reachable indices always form a prefix of the array: if index j is reachable, every index between 0 and j is reachable too, because any jump that lands at or beyond j could have been shortened. So the whole reachable set is described by one number, `farthest`, the largest index reachable so far. Scan i from left to right. If i > farthest, index i (and everything after it) cannot be reached, so return False. Otherwise extend farthest to max(farthest, i + nums[i]); once farthest >= len(nums) - 1 the last index is reachable and we return True. A single-element list returns True immediately because farthest = 0 already equals the last index. Each index is visited at most once, and only one integer of state is kept.

**Time:** O(n) · **Space:** O(1)
</details>
