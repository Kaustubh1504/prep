# Solve several coding interview problems
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Math / Number Theory

## Problem
This is a multi-part screen made of four short, independent problems. According to the overview they cover combinatorial string parsing, arbitrary-precision arithmetic on strings, intersecting ancestor chains, and geometric overlap counting. The exact original sub-problems are unknown. Each part below uses the most standard problem of its kind.

### Part 1 — Restore IP addresses (combinatorial parsing)
You get a string `s` of digits. Return every valid IPv4 address you can form by inserting exactly three dots into `s`, without reordering or removing any digit. A valid address has four parts. Each part is an integer from 0 to 255 with no leading zeros, so `"0"` is allowed but `"01"` is not. Return the addresses in the order produced by trying shorter segments first, from left to right. (This is lexicographic order by segment length, and it matches the examples.)

### Part 2 — Multiply big integers given as strings (arbitrary precision)
You get two integers `a` and `b` as decimal strings. Each may have a leading `'-'`. Return their product as a decimal string with no leading zeros, and write zero as `"0"`, never `"-0"`. Do not convert the whole strings to built-in big integers. Do the arithmetic digit by digit.

### Part 3 — Lowest common ancestor with parent pointers (ancestor-chain intersection)
Every tree node has a `parent` pointer, which is `None` at the root. You are given two nodes `p` and `q` from the same tree, but not the root. Return their lowest common ancestor. A node counts as its own ancestor. Use O(1) extra space. The two root-ward chains act like two linked lists that merge, so the answer is their intersection node.

### Part 4 — Count overlapping rectangle pairs (computational geometry)
You get axis-aligned rectangles `[x1, y1, x2, y2]` with `x1 < x2` and `y1 < y2`. Count the unordered pairs of rectangles whose intersection has **positive area**. Rectangles that only touch along an edge or at a corner do not count. Identical rectangles do count.

## Function signature
```python
# Part 1
def restore_ip_addresses(s: str) -> list[str]: ...

# Part 2
def multiply(a: str, b: str) -> str: ...

# Part 3
class Node:
    val: int
    parent: "Node | None"
def lowest_common_ancestor(p: Node, q: Node) -> Node: ...

# Part 4
def count_overlapping_pairs(rects: list[list[int]]) -> int: ...
```

## Constraints
- Part 1: `1 <= len(s) <= 20`, and `s` contains only digits
- Part 2: `1 <= len(a), len(b) <= 200` digits, with no leading zeros except for `"0"` itself
- Part 3: the tree has up to `10^5` nodes, and `p` and `q` are in the same tree
- Part 4: `0 <= len(rects) <= 10^4` and coordinates fit in 32-bit integers. Aim for a sort-plus-sweep solution that beats the naive all-pairs check when rectangles are spread out.

## Examples
**Part 1, Example 1**
Input: `s = "25525511135"`
Output: `["255.255.11.135", "255.255.111.35"]`

**Part 1, Example 2**
Input: `s = "101023"`
Output: `["1.0.10.23", "1.0.102.3", "10.1.0.23", "10.10.2.3", "101.0.2.3"]`

**Part 1, Example 3** (an edge case)
Input: `s = "0000"` gives Output: `["0.0.0.0"]`. Input `s = "1111111111111"` (13 digits) gives Output: `[]`.

**Part 2, Example 1**
Input: `a = "123", b = "456"`
Output: `"56088"`

**Part 2, Example 2** (edge cases)
`multiply("-99", "-99")` returns `"9801"`, and `multiply("-12", "0")` returns `"0"`. Also, `multiply("999999999999", "999999999999")` returns `"999999999998000000000001"`.

**Part 3, Example 1**
Tree: 3 has children 5 and 1. 5 has children 6 and 2. 2 has children 7 and 4. 1 has children 0 and 8.
`lowest_common_ancestor(node5, node1)` returns node `3`, and `lowest_common_ancestor(node6, node4)` returns node `5`.

**Part 3, Example 2** (an edge case)
`lowest_common_ancestor(node5, node4)` returns node `5`, because a node is its own ancestor. Also, `lowest_common_ancestor(node7, node7)` returns node `7`.

**Part 4, Example 1**
Input: `rects = [[0,0,2,2],[1,1,3,3],[2,0,4,1],[5,5,6,6]]`
Output: `1`
Explanation: Only rectangles 0 and 1 overlap with positive area. Rectangles 0 and 2 only share the line x = 2.

**Part 4, Example 2** (an edge case)
Input: `rects = [[0,0,1,1],[1,0,2,1],[0,1,1,2]]` gives Output: `0`, since every pair only touches. Input: `[[0,0,4,4],[1,1,2,2],[1,1,2,2]]` gives Output: `3`, since identical rectangles count.

<details><summary>Approach (spoiler)</summary>

**Part 1:** Backtrack over four segments of length 1–3. Skip a segment if it has a leading zero or is greater than 255. Prune when the remaining digits can't fill the remaining segments (more than 3 each or fewer than 1 each). There are at most 3^4 branches. **Time** O(1) for the bounded input, **Space** O(1).

**Part 2:** Grade-school multiplication. The product of digits `a[i]` and `b[j]` goes into slot `i + j + 1` of a result array of length `len(a) + len(b)`, and the carry goes into slot `i + j`. Strip leading zeros and apply the sign, special-casing zero. **Time** O(|a|·|b|), **Space** O(|a| + |b|).

**Part 3:** Run two pointers up the parent chains. When a pointer passes the root, restart it at the *other* starting node. Both pointers then travel `depth(p) + depth(q)` steps and meet at the first shared node, just like intersecting two linked lists. **Time** O(h), **Space** O(1).

**Part 4:** Sort the rectangles by `x1` and sweep. Keep an active list of rectangles whose `x2 > current x1` (they still overlap in x). Test each new rectangle against the active ones for strict y-overlap. **Time** O(n log n + Σ active) (O(n²) in the worst case), **Space** O(n). An interval tree on y would reduce the query cost.

```python
# Part 1
def restore_ip_addresses(s: str) -> list[str]:
    res = []
    def bt(i, parts):
        if len(parts) == 4:
            if i == len(s):
                res.append(".".join(parts))
            return
        rem = 4 - len(parts)
        if not (rem <= len(s) - i <= 3 * rem):
            return
        for L in (1, 2, 3):
            if i + L > len(s):
                break
            seg = s[i:i + L]
            if (L > 1 and seg[0] == "0") or int(seg) > 255:
                continue
            parts.append(seg)
            bt(i + L, parts)
            parts.pop()
    bt(0, [])
    return res

# Part 2
def multiply(a: str, b: str) -> str:
    neg = False
    if a[0] == "-": neg, a = not neg, a[1:]
    if b[0] == "-": neg, b = not neg, b[1:]
    if a == "0" or b == "0":
        return "0"
    res = [0] * (len(a) + len(b))
    for i in range(len(a) - 1, -1, -1):
        da = ord(a[i]) - 48
        for j in range(len(b) - 1, -1, -1):
            cur = res[i + j + 1] + da * (ord(b[j]) - 48)
            res[i + j + 1] = cur % 10
            res[i + j] += cur // 10
    k = 0
    while k < len(res) - 1 and res[k] == 0:
        k += 1
    out = "".join(map(str, res[k:]))
    return "-" + out if neg else out

# Part 3
def lowest_common_ancestor(p, q):
    a, b = p, q
    while a is not b:
        a = a.parent if a else q
        b = b.parent if b else p
    return a

# Part 4
def count_overlapping_pairs(rects: list[list[int]]) -> int:
    order = sorted(range(len(rects)), key=lambda i: rects[i][0])
    active, cnt = [], 0
    for i in order:
        x1, y1, x2, y2 = rects[i]
        active = [j for j in active if rects[j][2] > x1]   # still overlapping in x
        for j in active:
            if rects[j][1] < y2 and y1 < rects[j][3]:
                cnt += 1
        active.append(i)
    return cnt
```
</details>
