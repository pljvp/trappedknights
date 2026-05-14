# Trapped Knights

An interactive visualiser for two related but distinct chessboard-spiral phenomena, built around the [Ulam spiral](https://en.wikipedia.org/wiki/Ulam_spiral).

**Live app:** [pljvp.github.io/trappedknights](https://pljvp.github.io/trappedknights)

---

## Two different problems

### Competitive placement (Multiple Knights, Mixed Pieces, RPS modes)

Two or more armies take turns placing pieces on the **lowest-numbered spiral square** not currently attacked by an opponent. No piece is ever stuck — there is always a free square further out on the spiral. The interesting question is what large-scale territorial pattern emerges from millions of greedy local decisions.

### Trapped Knight / Zebra / Antelope (Trapped modes)

A **single piece** starts on square 1 and each turn moves to the **lowest-numbered unvisited square** it can reach. It keeps moving until every square it could jump to has already been visited — at which point it is genuinely trapped and cannot move.

These are completely separate algorithms. In competitive placement, pieces are *placed* (no movement); in the trapped modes, one piece *moves* along a trail.

---

## The Trapped Knight sequence

The standard knight (moves ±1,±2 or ±2,±1) gets trapped after exactly **2,016 moves**, ending on spiral square **2,084**.

**OEIS:** [A316667](https://oeis.org/A316667) — *Trapped knight: squares visited in order*  
First terms: 1, 10, 3, 6, 9, 4, 7, 2, 5, 8, 11, …

Other leapers also get trapped, but after different path lengths.

---

## Piece types

| Piece | Move | Notes |
|-------|------|-------|
| Knight | (±1,±2) or (±2,±1) | Standard chess knight; trapped at step 2016 (OEIS A316667) |
| Zebra | (±2,±3) or (±3,±2) | Fairy chess leaper |
| Antelope | (±3,±4) or (±4,±3) | Fairy chess leaper |
| Alfil | (±2,±2) | Diagonal jumper (restricted colour) |
| Dabbaba | (±2,0) or (0,±2) | Orthogonal jumper |
| Ferz | (±1,±1) | One-step diagonal |
| Wazir | (±1,0) or (0,±1) | One-step orthogonal |

---

## How to use

1. **Select a mode** from the dropdown:
   - *2 Knights, 3 Knights, …* — competitive placement with identical pieces
   - *Mixed Pieces* / *RPS* — competitive placement with different piece types
   - *Trapped Knight / Zebra / Antelope* — single-piece greedy walk
2. **Board size** controls how many spiral squares are generated (competitive modes only).
3. **Shape** switches piece attack visualisation between circles and squares.
4. Click **Generate**.

In Trapped modes a result box appears showing the step count, final square, and the first terms of the sequence.

Hover over any legend chip for a tooltip describing that team or piece.

---

## Run locally

No build step required — plain HTML/CSS/JS.

```bash
git clone https://github.com/pljvp/trappedknights.git
cd trappedknights
# open index.html in your browser, or serve with any static server:
npx serve .
```

---

## References & credits

- **Neil Sloane** (OEIS founder) — original Trapped Knight problem  
- **Jonas Karlsson** — independent discoverer  
- [The Trapped Knight — Numberphile](https://www.youtube.com/watch?v=RGQe8waGJ4w)  
- [Red & Black Knights — Numberphile](https://www.youtube.com/watch?v=UiX4CFIiegM)  
- [Amazing Chessboard Patterns (extra footage)](https://www.youtube.com/watch?v=VgmDuBCayPw)  
- [OEIS A316667](https://oeis.org/A316667)
