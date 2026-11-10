# Blind Maze Escape: Shortest Command Sequence That Exits From Every Start Cell
> Google · Onsite · hard · Pattern: Graph BFS / DFS
> Source: https://prachub.com/interview-questions/blind-maze-escape-shortest-command-sequence-that-exits-from-every-start-cell

A robot is somewhere in a maze drawn on a rectangular grid, where `#` is a wall, `.` is an open cell and `E` is the exit. The robot understands four commands, `U` (up), `D` (down), `L` (left) and `R` (right), and each command moves it at most one cell.

You do not know which open cell the robot starts in, and the robot gives no feedback while it runs: the only thing that ever happens is that it reaches the exit and stops. You therefore have to fix the whole command sequence in advance.

Find a command sequence that works wherever the robot starts: from every `.` cell, executing the sequence makes the robot reach `E` at some point. Return the shortest such sequence, breaking ties as described in the rules.

For illustration, here is a maze of the kind this problem uses:

```text
##########
#..#..E..#
#..#.....#
#..##..#.#
#......#.#
##########
```

With rows and columns numbered from 0, a robot at row 4, column 3 that receives `U` stays where it is, because row 3, column 3 is a wall. A robot at row 4, column 5 that receives `U` moves to row 3, column 5.

### Function Signature

```python
def blind_exit_sequence(maze: list[str]) -> str:
```

### Rules

- `maze[r][c]` is the cell in row `r` and column `c`. Row 0 is the top row and column 0 is the leftmost column. `U` decreases the row by 1, `D` increases the row by 1, `L` decreases the column by 1 and `R` increases the column by 1.
- Commands are executed one at a time. If the target cell is a wall or lies outside the grid, the robot stays where it is; this is not an error, and execution continues with the next command. Otherwise the robot moves to the target cell.
- As soon as the robot stands on `E`, it has escaped and ignores all remaining commands.
- Every `.` cell is a possible starting cell. A sequence is valid if, for every possible starting cell, the robot stands on `E` after some prefix of the sequence (not necessarily the whole sequence).
- Return a valid sequence of minimum length, as a string made only of the characters `U`, `D`, `L` and `R`. If several valid sequences have that length, return the smallest one in ordinary string comparison, which orders the commands `D < L < R < U`.
- If the maze has no `.` cell, return the empty string.

### Constraints

- `1 <= R <= 10`, where `R = len(maze)`.
- `1 <= C <= 10`, where `C = len(maze[r])` for every row `r`.
- Every character is `#`, `.` or `E`, and exactly one cell is `E`.
- At most 30 cells are open (`.` or `E` combined).
- Every `.` cell is connected to the `E` cell by a path of open cells that moves up, down, left or right one cell at a time. This guarantees that at least one valid sequence exists.

### Examples

**Example 1**

```text
Input:  maze = ["#.E.#"]
Output: "LR"
```

The possible starts are columns 1 and 3. No single command works: `L` brings only the robot from column 3 to the exit, `R` only the robot from column 1, and `U` or `D` would leave the grid, so they move nothing. With `LR`, the robot from column 3 exits on `L`, and the robot from column 1 bumps into the wall on `L`, stays in column 1, and exits on `R`. Every length-2 sequence smaller than `LR` (`DD`, `DL`, `DR`, `DU`, `LD`, `LL`) leaves one of the two starts short of the exit.

**Example 2**

```text
Input:  maze = [
  "####",
  "#.E#",
  "#..#",
  "####"
]
Output: "RU"
```

The possible starts are (row 1, column 1), (row 2, column 1) and (row 2, column 2), and no single command reaches the exit from all three. With `RU`: from (1, 1), `R` reaches the exit; from (2, 1), `R` moves to (2, 2) and `U` reaches the exit; from (2, 2), `R` hits the wall and `U` reaches the exit. `UR` is also valid, but `RU` is smaller. No valid sequence of length 2 starts with `D` or `L`, and `RD`, `RL` and `RR` are not valid either.

**Example 3**

```text
Input:  maze = ["#E#"]
Output: ""
```

There is no `.` cell, so there is no starting cell to guide and the empty sequence is returned.

<details><summary>Hints (spoiler)</summary>

1. Two different starting cells can end up on the same cell after bumping into a wall or the grid edge; from then on they react identically to every command.
2. A start that has reached E no longer constrains the rest of the sequence, so only the robots that have not escaped yet matter.
3. Equal-length sequences are compared from their first command, using the order D < L < R < U.
</details>

<details><summary>Approach (spoiler)</summary>

Because the robot gives no feedback, all that matters after any prefix of commands is the set of cells on which a robot that has not escaped yet may stand. Number the `.` cells 0..N-1 (N <= 29, since at most 30 cells are open and one of them is `E`) and store that set as a bitmask. For every command and every `.` cell, precompute the result of one step: the neighbouring `.` cell, the same cell when the target is a wall or outside the grid, or 'escaped' when the target is `E`. Escaped robots are simply dropped from the set, which models absorption and makes validity a prefix property. Applying a command to a set is the union of the images of its cells, so merged starts (for example after a wall bump) collapse into one bit. A sequence is valid exactly when it drives the full set of `.` cells to the empty set, so the answer is a shortest path from the full mask to 0 in the implicit graph of reachable sets. Run BFS from the full mask, expanding commands in the order D, L, R, U and keeping only the first discovery of every set. By induction on the depth, BFS dequeues each layer's sets in increasing order of their smallest shortest command string, so the first time the empty set is discovered its path is both of minimum length and the smallest under D < L < R < U; it is rebuilt from the parent pointers. Edge cases: with no `.` cell the answer is the empty string; a start that crosses `E` early never constrains later commands; connectivity of every `.` cell to `E` guarantees that the empty set is reachable (route the remaining starts to the exit one at a time).

**Time:** O(S * 4 * N), where N <= 29 is the number of '.' cells and S <= 2^N is the number of distinct reachable sets of robot positions · **Space:** O(S + N)
</details>
