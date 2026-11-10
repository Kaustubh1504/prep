# Match Dictionary Words to a Swipe-Keyboard Gesture Path
> Google · Onsite · medium · Pattern: Two Pointers, String Processing
> Source: https://prachub.com/interview-questions/match-dictionary-words-to-a-swipe-keyboard-gesture-path

On a swipe keyboard, the user drags one finger across the letters instead of tapping each key, and the keyboard has to work out which word was meant. The gesture is recorded as the ordered list of keys the finger passed over, from the key where it touched down to the key where it lifted. Given that path and a dictionary, return every dictionary word the gesture could spell.

The interview version was ambiguous about exactly when a word counts as a match; this practice version fixes the rules below so that the answer is unique.

### Function Signature

```python
def swipe_matches(path: str, words: list[str]) -> list[str]:
```

### Rules

- `path` is the sequence of keys the finger crossed, in order. A letter may appear in it more than once.
- Let `n = len(path)`. A word `w` with `m = len(w)` letters matches `path` when every letter `w[j]` can be assigned a position `i[j]` in `path` such that:
  - `path[i[j]] == w[j]` for every `j`;
  - `i[0] == 0`: the word starts on the key where the gesture started;
  - `i[m - 1] == n - 1`: the word ends on the key where the gesture ended;
  - positions never move backwards: `i[0] <= i[1] <= ... <= i[m - 1]`.
- Because two consecutive letters may share a position, a doubled letter such as the `ll` in `hello` can be spelled by passing over a single `l` key once.
- It follows that a one-letter word matches only when `path` itself is that single letter.
- Return each distinct matching word once, sorted in ascending lexicographic order (plain character comparison). Return an empty list if nothing matches.

### Constraints

- `1 <= len(path) <= 2000`
- `1 <= len(words) <= 10000`
- `1 <= len(w) <= 30` for every `w` in `words`
- The total number of letters across all of `words` is at most `200000`.
- `path` and every word contain only lowercase English letters `a` to `z`.
- `words` may contain duplicates and is in no particular order.

### Examples

**Example 1**

```text
path   = "hgreasdfghjklo"
words  = ["hello", "halo", "hero", "help", "hallo", "halo", "hole"]
output = ["hallo", "halo", "hello"]
```

- `hello`: `h` at 0, `e` at 3, both `l`s at 12, `o` at 13, the last position.
- `halo` and `hallo`: `h` at 0, `a` at 4, `l` at 12, `o` at 13. `halo` appears twice in `words` but once in the output.
- `hero` fails because the only `r` (position 2) comes before the only `e` (position 3).
- `help` and `hole` fail because the gesture ends on `o`, not on their last letter.

**Example 2**

```text
path   = "abcd"
words  = ["add", "abd", "acbd", "a", "abbd", "bad"]
output = ["abbd", "abd", "add"]
```

- `acbd` fails: once `c` is placed at position 2, there is no `b` at or after it.
- `a` fails: a one-letter word cannot span a four-key gesture.
- `bad` fails: the gesture starts on `a`.

**Example 3**

```text
path   = "a"
words  = ["a", "aa", "ab"]
output = ["a", "aa"]
```
