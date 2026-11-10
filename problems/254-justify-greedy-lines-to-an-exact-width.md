# Justify Greedy Lines to an Exact Width
> Google · Other · hard · Pattern: Greedy
> Source: https://prachub.com/interview-questions/justify-greedy-lines-to-an-exact-width

### Problem

Format the nonempty array `words` into lines of exactly `maxWidth` characters. Keep the words in their given order and put as many words as possible on each line, counting at least one separating space between adjacent words.

For a line other than the last, distribute its spaces between words as evenly as possible. When a remainder exists, the gaps on the left receive one more space than those on the right. A line containing one word is padded on the right.

The last line is left-justified: put exactly one space between adjacent words and pad the remainder on the right. Do not split words or add non-space padding.

```cpp
vector<string> fullJustify(vector<string>& words, int maxWidth);
```

### Examples

```text
Input: words = ["Pack","these","words","well"], maxWidth = 11
Output: ["Pack  these","words well "]
```

The first line has two spaces in its only gap. The last has one separating space and one trailing space. Both lengths are 11.

```text
Input: words = ["a","bb","c","dddd"], maxWidth = 9
Output: ["a   bb  c","dddd     "]
```

The first line's five spaces are split as three in the left gap and two in the right. The last line has five trailing spaces.

### Constraints

- `1 <= words.length <= 300`.
- `1 <= words[i].length <= 20`, and each word fits within `maxWidth`.
- Words consist of English letters and symbols and contain no spaces.
- `1 <= maxWidth <= 100`.
- Word boundaries are fixed by the input array. The padding character is the ordinary space `' '`.
