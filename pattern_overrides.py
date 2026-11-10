"""Manual pattern assignments for questions the keyword rules misclassify.

Reviewed from each question's title and one-line summary. Maps rank -> (primary, [secondary...]).
"""
UF, TOPO, SP, TRIE, SEG = "Union-Find", "Topological Sort", "Shortest Path", "Trie", "Segment Tree / Fenwick"
MONO, SW, TP, PS, BS = "Monotonic Stack", "Sliding Window", "Two Pointers", "Prefix Sum", "Binary Search"
HEAP, IV, STACK, DP, BT = "Heap / Top-K", "Intervals / Sweep Line", "Stack / Parsing", "Dynamic Programming", "Backtracking"
GRAPH, TREE, LL, DESIGN, GREEDY = "Graph BFS / DFS", "Tree Traversal / BST", "Linked List", "Design / Data Structure", "Greedy"
BIT, RAND, MATH, HASH, SORT = "Bit Manipulation", "Randomized / Probability", "Math / Number Theory", "Hashing / Counting", "Sorting"
SIM, STR, OTHER = "Simulation", "String Processing", "Other (non-coding)"

OVERRIDES = {
    # Connectivity that grows over time or merges groups
    1: (UF, [GRAPH]), 18: (UF, [SORT]), 109: (UF, [GRAPH]), 180: (UF, [GRAPH]), 288: (UF, [GRAPH]), 398: (UF, [SORT]),
    # Weighted / constrained paths
    80: (SP, [BS]), 97: (SP, [GRAPH]), 130: (SP, [GRAPH]), 160: (SP, [GRAPH]), 166: (SP, [GRAPH]), 200: (SP, [BS]),
    221: (SP, [GRAPH]), 265: (SP, [GRAPH]), 306: (SP, [GRAPH]), 360: (SP, [BS]),
    # Plain graph / grid traversal
    93: (GRAPH, []), 142: (GRAPH, [STACK]), 145: (GRAPH, [UF]), 262: (GRAPH, [TOPO]), 388: (GRAPH, [BT]), 470: (GRAPH, [TOPO]),
    # Dynamic programming
    20: (DP, []), 39: (DP, []), 60: (DP, [STR]), 72: (DP, []), 73: (DP, [SW]), 94: (DP, [STR]), 111: (DP, [SW]), 146: (DP, []),
    188: (DP, []), 210: (DP, [TRIE]), 212: (DP, [SORT, BS]), 321: (DP, []), 379: (DP, []), 412: (DP, []), 430: (DP, [GRAPH]),
    444: (GRAPH, [GREEDY]), 459: (DP, []),
    # Trie
    195: (TRIE, []), 358: (TRIE, [BS]), 361: (TRIE, [STR]),
    # Monotonic stack
    33: (MONO, []), 13: (MONO, []),
    # Sliding window / two pointers
    62: (TP, []), 76: (TP, [STR]), 138: (TP, [SORT]), 182: (TP, [STR]), 232: (SW, [HASH]), 247: (SW, [TP]), 268: (SW, [HASH]),
    274: (TP, []), 295: (SW, [HASH]), 338: (SW, []), 429: (TP, [BS]), 436: (STR, [TP]), 457: (TP, []), 471: (TP, [STR]),
    483: (STR, [TP]),
    # Prefix sums
    199: (PS, [SEG]), 227: (PS, []), 363: (PS, [SEG]), 383: (PS, [DESIGN]), 473: (PS, [HASH]),
    # Binary search (including on the answer)
    174: (BS, []), 198: (BS, [MATH]), 366: (BS, [STR]), 378: (BS, []), 409: (BS, [MATH]),
    # Intervals with a heap of free resources
    45: (IV, [HEAP]), 240: (IV, [HEAP]), 328: (IV, [HEAP]),
    # Heap / greedy
    279: (HEAP, [GREEDY, SORT]), 281: (GREEDY, [HEAP]), 356: (HEAP, [HASH]), 120: (GREEDY, []),
    # Hashing / counting
    53: (HASH, []), 83: (HASH, [BIT]), 169: (HASH, [BIT]), 186: (HASH, [BIT]), 241: (HASH, [SORT, GREEDY]), 255: (HASH, []),
    456: (HASH, []), 458: (HASH, [STR]), 467: (HASH, [STR]),
    # Design / data structures
    69: (DESIGN, [HEAP]), 213: (DESIGN, [TREE]), 276: (DESIGN, [STACK]), 287: (DESIGN, [RAND]), 329: (DESIGN, [HASH]),
    334: (DESIGN, [STACK]), 390: (DESIGN, [STACK]), 463: (DESIGN, [STACK]), 478: (DESIGN, [SIM]), 484: (DESIGN, []),
    # Segment tree / BIT
    479: (SEG, [SORT]),
    # Strings, math, simulation
    75: (STR, [HASH]), 117: (STR, [SIM]), 177: (STR, [SIM]), 236: (STR, [DESIGN]), 273: (STR, [STACK]), 206: (MATH, [BT]),
    271: (SIM, []), 340: (SIM, []), 289: (RAND, [BT]),
    # Later downloads
    508: (DP, []), 509: (STACK, []), 510: (BS, [TP]), 513: (HASH, []), 514: (DESIGN, [HEAP]), 515: (HASH, [TP]),
    519: (DP, [BT]), 538: (HASH, []),
    # Not a coding question despite the category
    136: (OTHER, []),
}
