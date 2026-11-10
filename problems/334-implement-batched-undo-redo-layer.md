# Implement Batched Undo/Redo Layer
> Google · Technical Screen · easy · Pattern: Design / Data Structure, Stack / Parsing
> Source: https://prachub.com/interview-questions/implement-batched-undo-redo-layer

You are implementing a simplified document layer for a design tool. The layer stores properties as a `map<string, string>`.

Implement a class that supports the following operations:

- `beginBatch()`: start a batch of edits.
- `setProperty(key, value)`: set or overwrite a property inside the current batch.
- `endBatch()`: commit the batch as one undoable action.
- `undo()`: revert the most recently committed batch.
- `redo()`: reapply the most recently undone batch.

Requirements:

1. A batch may update the same key multiple times.
2. `undo()` must restore the exact document state from before that batch.
3. `redo()` must restore the exact document state after that batch.
4. If a property did not exist before the batch, then `undo()` should remove that property.
5. If `undo()` has been called and then a new batch is committed, the redo history must be cleared.
6. Follow-up: make the history memory-efficient. Instead of storing every intermediate edit in a batch, compact the batch so that each key appears at most once in history while still preserving enough information for correct `undo()` and `redo()`.

A useful compact record for one key is:

```text
Change {
  string key;
  string value;        // final value after the batch
  string old_value;    // value before the batch
  bool has_old_value;  // whether the key existed before the batch
}
```

Explain how you would build and use such a compact history so that repeated updates to the same key inside one batch do not waste memory.

<details><summary>Hints (spoiler)</summary>

1. For each key touched in the current batch, record its old value only the first time that key is edited in the batch.
2. Use two stacks: one for committed batches that can be undone, and one for undone batches that can be redone. Clear the redo stack when a new non-empty batch is committed.
</details>
