# Arrange Crops into Connected Regions in Rectangular and Two-Square Gardens
> Google · Onsite · medium · Pattern: Graph BFS / DFS
> Source: https://prachub.com/interview-questions/arrange-crops-into-connected-regions-in-rectangular-and-two-square-gardens

A rectangular garden has `N` rows and `M` columns. There are `K` crop types, labeled `1` through `K`. Crop `i` must occupy exactly `count[i]` cells, and the counts sum to `N × M`.

Return any arrangement that uses every garden cell exactly once and places each crop in one connected region. Connectivity uses shared edges only: up, down, left, and right. Diagonal contact does not connect two cells. Different crop types have no additional relationship requirements.

The interview also asks how the problem changes when the available area consists of two square gardens of sizes `N × N` and `M × M` placed next to each other.

### Constraints & Assumptions

- Use positive integer dimensions and non-negative integer crop counts as practice input conventions; the source supplies no size limits.
- A crop with count zero occupies no cells and needs no connected region. Every crop with a positive count must occupy exactly one connected component.
- Any valid arrangement is accepted. There is no required visual pattern, crop ordering, or lexicographically smallest result.
- In the two-square follow-up, the total planted area is `N² + M²`; the squares do not overlap. Connectivity still means shared cell edges.
- **Geometry limitation:** the report describes the squares as adjacent but does not unambiguously specify their relative offset or exact shared boundary. Do not assume that the available area is one rectangle or that a particular alignment was required. State what geometry information is needed before producing a concrete follow-up arrangement.

### Clarifying Questions to Ask

- Are crop counts allowed to be zero? Use the convention above for this exercise.
- For the two squares, which cells share edges across their boundary, and can a crop span both squares?
- Is a feasible assignment guaranteed for the supplied follow-up shape and counts? If not, agree on how to report that none exists.
- Is the follow-up expected to have a scalable construction for a particular placement, or is a correct general search acceptable for small input sizes?

### Part 1 — Construct an Arrangement for the Rectangle

Describe an algorithm that returns a valid `N × M` arrangement for every count vector satisfying the stated conditions. Explain why each crop has exactly its required count and remains connected. Analyze its time and space use, including the output.

#### What This Part Should Cover

- A constructive argument covering every cell without revisiting or skipping cells.
- A reason each crop's allocated cells form an edge-connected region, including across row boundaries.
- Single-row and single-column gardens, zero-count crops, and counts that cross several rows.

### Part 2 — Extend the Reasoning to Two Squares

Identify the missing placement information. Once the interviewer provides the occupied cells and their shared-edge adjacency, explain how you would find a valid arrangement or establish that no arrangement exists when feasibility is not guaranteed.

Distinguish a fast construction that depends on an appropriate traversal of the shape from a complete but potentially expensive method that does not assume such a traversal exists. Do not claim that arbitrary row-by-row filling preserves connectivity across an irregular boundary.

#### What This Part Should Cover

- A precise representation of the two-square shape and cross-square edges before reasoning about connectivity.
- The condition under which the rectangular construction can be reused.
- A complete search fallback, its correctness, and its computational limitations rather than an unsupported universal performance claim.

```hint Look at successive allocated cells
If every consecutive pair of cells in a traversal shares an edge, consider what happens when one crop receives a consecutive interval of that traversal.
```

```hint Check the shape before reusing the path
Two adjacent squares need not form a rectangle. A move that joins the end of one row to the beginning of the next must still stay inside the actual garden and cross a shared edge.
```

### What a Strong Answer Covers

- A linear-output-size rectangular construction with a connectivity proof.
- Exact count preservation, four-neighbor adjacency, and acceptance of any valid output.
- An explicit geometry caveat for the follow-up and a correct conditional construction or complete search after that geometry is supplied.
- Honest complexity bounds and no invented requirement that a particular arrangement be returned.

### Follow-up Questions

- How would you validate an arbitrary proposed arrangement independently of the algorithm that produced it?
- Why can straightforward left-to-right filling on every row break a crop's connectivity at a row boundary?
- If a continuous traversal of the follow-up shape is unavailable, why does that alone fail to prove that the requested crop arrangement is impossible?
