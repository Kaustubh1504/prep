# Find top/bottom-k words in list or stream
> Google · Technical Screen · medium · Pattern: Heap / Top-K, Simulation, Design / Data Structure
> Source: https://prachub.com/interview-questions/find-top-bottom-k-words-in-list-or-stream

You are given words (strings) either as a finite list or as an unbounded stream.

1) **List version**: Given an array `words` and an integer `k`, return:
- the `k` most frequent distinct words, and
- the `k` least frequent distinct words.

Specify how you break ties (e.g., lexicographically, or any order).

2) **Stream version (online)**: Design a data structure that supports:
- `ingest(word)`: process the next word in the stream
- `topK(k)`: return the `k` most frequent distinct words seen so far
- `bottomK(k)`: return the `k` least frequent distinct words seen so far

Discuss time/space complexity and how you would implement these operations efficiently.

3) **Variant (discuss/design)**: Extend the stream design to support returning the **first `k`** and/or **last `k`** words that are currently **non-repeating** (i.e., words with frequency exactly 1) according to stream arrival order.

<details><summary>Hints (spoiler)</summary>

1. Count how many times each distinct word appears before deciding the answer.
2. You can sort the distinct words twice: once by (-frequency, word) and once by (frequency, word).
</details>
