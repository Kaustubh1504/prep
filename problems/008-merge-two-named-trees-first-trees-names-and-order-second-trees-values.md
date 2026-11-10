# Merge Two Named Trees: First Tree's Names and Order, Second Tree's Values
> Google · Onsite · hard · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/merge-two-named-trees-first-trees-names-and-order-second-trees-values

Each tree node is a dictionary with three keys: `name` (a string), `value` (an integer) and `children` (an ordered list of child nodes). Given the roots `t1` and `t2` of two such trees, merge them into a new tree. The guiding principle is that the merged tree follows the node order of `t1` and takes its values from `t2`.

### Function Signature

```python
def merge_trees(t1: dict, t2: dict) -> dict:
```

### Rules

Merging a node `a` from the first tree with a node `b` from the second tree produces a node `m`:

1. `m["name"]` is `a["name"]`, and `m["value"]` is `b["value"]`.
2. Children are paired by name in order of appearance. For every name, the `j`-th child of `a` with that name is paired with the `j`-th child of `b` with that name, for every `j` at which both exist. Each pair is merged recursively by these same rules.
3. `m["children"]` starts with all children of `a`, in their original order. A paired child is replaced by its merged result. An unpaired child of `a` is copied unchanged, together with its whole subtree.
4. The unpaired children of `b` follow, in their original order in `b`, each copied unchanged together with its whole subtree.

The roots `t1` and `t2` are always merged with each other by these rules, even when their names differ.

Every node in the returned tree has exactly the keys `name`, `value` and `children`, and a leaf has `"children": []`. The returned tree is compared with the expected tree exactly, including the order of every `children` list. Whether the function modifies `t1` or `t2` is not checked.

### Constraints

- Each tree has between `1` and `10^4` nodes.
- The depth of each tree, counted in nodes on its longest root-to-leaf path, is at most `500`.
- Every `name` is a nonempty string of at most `20` lowercase English letters and digits. Siblings may share a name, and a name may appear anywhere in either tree.
- Every `value` is an integer with `-10^9 <= value <= 10^9`.
- The merged tree has fewer than `2 * 10^4` nodes.

### Examples

**Example 1**

```text
Input:
t1 = {"name": "root", "value": 1, "children": [
  {"name": "a", "value": 2, "children": []},
  {"name": "b", "value": 3, "children": []}
]}
t2 = {"name": "top", "value": 10, "children": [
  {"name": "b", "value": 30, "children": []},
  {"name": "c", "value": 40, "children": []}
]}
Output:
{"name": "root", "value": 10, "children": [
  {"name": "a", "value": 2, "children": []},
  {"name": "b", "value": 30, "children": []},
  {"name": "c", "value": 40, "children": []}
]}
```

The root takes the name `root` from `t1` and the value `10` from `t2`, even though the two root names differ. `a` is unpaired and kept as it is, `b` is paired and takes the value `30`, and `c` is an unpaired child of `t2`, so it is appended at the end.

**Example 2**

```text
Input:
t1 = {"name": "r", "value": 0, "children": [
  {"name": "x", "value": 1, "children": [
    {"name": "y", "value": 2, "children": []}
  ]},
  {"name": "z", "value": 3, "children": []},
  {"name": "x", "value": 4, "children": []}
]}
t2 = {"name": "r", "value": 9, "children": [
  {"name": "x", "value": 5, "children": [
    {"name": "w", "value": 6, "children": []},
    {"name": "y", "value": 7, "children": []}
  ]},
  {"name": "x", "value": 8, "children": []},
  {"name": "x", "value": 11, "children": [
    {"name": "v", "value": 12, "children": []}
  ]}
]}
Output:
{"name": "r", "value": 9, "children": [
  {"name": "x", "value": 5, "children": [
    {"name": "y", "value": 7, "children": []},
    {"name": "w", "value": 6, "children": []}
  ]},
  {"name": "z", "value": 3, "children": []},
  {"name": "x", "value": 8, "children": []},
  {"name": "x", "value": 11, "children": [
    {"name": "v", "value": 12, "children": []}
  ]}
]}
```

The two `x` children of `t1` pair with the first two `x` children of `t2`. The third `x` of `t2` (value `11`) is unpaired, so it goes last, together with its child `v`. Inside the first pair, `y` pairs with `y` and takes the value `7`, and the unpaired `w` is appended after it. `z` exists only in `t1` and keeps its value `3`.
