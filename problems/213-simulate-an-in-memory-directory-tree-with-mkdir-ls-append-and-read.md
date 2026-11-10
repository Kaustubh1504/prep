# Simulate an In-Memory Directory Tree with mkdir, ls, Append and Read
> Google · Other · medium · Pattern: Design / Data Structure, Tree Traversal / BST
> Source: https://prachub.com/interview-questions/simulate-an-in-memory-directory-tree-with-mkdir-ls-append-and-read

Reported from a Google software engineering coding interview.

Simulate a small in-memory file system. It starts with only the root directory `/`. You receive a sequence of operations and must return the output of each one, in order.

The four operations are:

- `mkdir path`: create the directory at `path`, also creating any missing directories along the way. If the directory already exists, do nothing. Output: `[]`.
- `add path content`: if no file exists at `path`, create it (creating any missing directories along the way) with `content` as its text. If the file already exists, append `content` to the end of its current text. Output: `[]`.
- `read path`: output the file's full current text as a one-element list, `[text]`.
- `ls path`: if `path` is a file, output a one-element list containing the file's own name. If `path` is a directory, output the names of its direct children (both files and directories), sorted in ascending lexicographic order. An empty directory outputs `[]`.

### Function Signature

```python
def simulate_file_system(operations: list[str], arguments: list[list[str]]) -> list[list[str]]:
```

`operations[i]` is one of `"mkdir"`, `"add"`, `"read"`, `"ls"`. `arguments[i]` is `[path]` for `mkdir`, `read` and `ls`, and `[path, content]` for `add`. Return a list with exactly one output per operation.

### Rules

- Every path is absolute: it starts with `/`, components are separated by single `/` characters, and there is no trailing `/` except for the root path `/` itself.
- `ls` may be called on `/`; `mkdir` and `add` are never called on `/`.
- A name inside one directory refers to either a file or a directory, never both. Inputs never use a file as if it were a directory (no path passes through an existing file), never `mkdir` an existing file path, and never `add` to an existing directory path.
- `read` is only called on existing files, and `ls` only on existing paths.
- Names contain only lowercase letters, so ascending order is plain string comparison.

### Constraints

- `1 <= len(operations) == len(arguments) <= 300`
- `1 <= len(path) <= 100`
- Each path component is a non-empty string of lowercase letters `a` to `z`.
- `1 <= len(content) <= 50`, lowercase letters only.

### Examples

**Example 1**

- Input:
  - `operations = ["ls", "mkdir", "add", "ls", "read"]`
  - `arguments = [["/"], ["/a/b/c"], ["/a/b/c/d", "hello"], ["/"], ["/a/b/c/d"]]`
- Output: `[[], [], [], ["a"], ["hello"]]`
- Explanation: the root starts empty. `mkdir` creates `/a`, `/a/b` and `/a/b/c`; `add` creates the file `d` inside `/a/b/c`. Listing the root shows only `a`.

**Example 2**

- Input:
  - `operations = ["add", "add", "mkdir", "ls", "ls", "read"]`
  - `arguments = [["/notes", "ab"], ["/notes", "cd"], ["/docs/old"], ["/"], ["/notes"], ["/notes"]]`
- Output: `[[], [], [], ["docs", "notes"], ["notes"], ["abcd"]]`
- Explanation: the second `add` appends to the existing file. Listing the root returns the directory `docs` and the file `notes` in sorted order; listing a file path returns just that file's name.

**Example 3**

- Input:
  - `operations = ["mkdir", "add", "add", "ls", "mkdir", "ls"]`
  - `arguments = [["/x/zeta"], ["/x/alpha", "q"], ["/x/mid/file", "r"], ["/x"], ["/x/zeta"], ["/x/mid"]]`
- Output: `[[], [], [], ["alpha", "mid", "zeta"], [], ["file"]]`
- Explanation: `/x` ends up holding the file `alpha` and the directories `mid` and `zeta`. Creating `/x/zeta` a second time changes nothing.
