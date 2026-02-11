# Plum Blossom Computer (梅花電腦) — Slide Deck
## EasyA x Consensus Hong Kong 2026

> 3 minutes total. 1 minute Q&A. Each section ~30 seconds (~75 words spoken).

---

## SLIDE 1 — TITLE

**Plum Blossom Computer (梅花電腦)**

*A deterministic oracle that fuses 1,000 years of Chinese cosmological math with real-time astronomy — cryptographically anchored on Ethereum.*

EasyA x Consensus Hong Kong 2026

---

## SLIDE 2 — THE TEAM (30 seconds)

### Augustin Chan
**CTO & Founder, Digital Rain Studios** | Hong Kong
[augustinchan.dev](https://augustinchan.dev) | [github.com/augchan42](https://github.com/augchan42)

- B.S. Cognitive Science (Computation), UC San Diego
- 20+ years enterprise architecture — 12 years at Informatica as Development Architect serving Fortune 500 clients across APAC/MENA, 5 years pre-sales at Dun & Bradstreet
- Currently building production AI agents and autonomous systems at Digital Rain Studios
- Consensus HK 2025 hackathon track winner with **Pix** — an AI agent that interprets Arxiv research through the I Ching, persisting to OriginTrail knowledge graph. Pix is still live. Featured by CoinDesk.
- Speaker: Taipei Blockchain Week, WOW Summit, AI+Power HK

*Speaking notes (~75 words):*
> Hi, I'm Augustin Chan, CTO of Digital Rain Studios, based here in Hong Kong. Cognitive Science degree from UC San Diego, 12 years as a Development Architect at Informatica serving Fortune 500 clients across APAC. Some of you may remember — I won a track here at Consensus HK last year with Pix, my AI agent that does I Ching interpretations of Arxiv research papers, persisting to OriginTrail's knowledge graph. She's still live. This year I'm back with the Plum Blossom Computer — same cosmological thread, but now the readings are anchored on-chain as a simple oracle.

---

## SLIDE 3 — THE PROBLEM (30 seconds)

**On-chain oracles are black boxes. Ancient oracles have zero accountability.**

*Speaking notes (~75 words):*
> Today's on-chain oracles — Chainlink, Pyth — relay external data. You trust the network, not the computation. You can't independently verify what they report. Meanwhile, ancient decision-making systems like the I Ching encode centuries of pattern recognition, but a fortune teller can revise their reading after the fact. There's no system that makes its reasoning fully transparent, lets users choose which frameworks to trust, and creates a tamper-proof record. Until now.

---

## SLIDE 4 — SOLUTION & VISION (30 seconds)

**A meta-oracle: deterministic, transparent, and tamper-proof.**

*Speaking notes (~75 words):*
> The Plum Blossom Computer runs a deterministic 7-layer pipeline — hexagrams, Four Pillars, macro cycles, planetary positions via NASA-grade VSOP87 ephemeris. Same timestamp in, same result out, every time. It produces a bias signal: act, observe, avoid, or neutral. Users see the full reasoning graph and can accept or reject each branch — Chinese Cosmology or Modern Astronomy. One click commits the result on-chain with keccak256 hashes. Anyone can recompute and verify. The vision: a composable oracle primitive that other protocols can reference.

---

## SLIDE 5 — DEMO (30 seconds)

*Show the live app. Hit these beats quickly:*

1. **Dashboard** — Point at hexagram, Four Pillars, planetary positions, moon phase panels
2. **Reasoning Tree** — Expand branches, show bias signals from each
3. **Toggle** — Reject a branch → synthesis updates in real time
4. **Commit on-chain** — Click "Commit Signal On-Chain", sign MetaMask tx, show confirmation
5. **Commitment history** — Show the on-chain record table with hashes

*Speaking notes (~75 words):*
> Here's the live dashboard — you can see the current hexagram, Four Pillars, real planetary positions, and moon phase, all computed client-side with zero API calls. The reasoning tree shows two branches producing bias signals. Watch — if I reject the astronomical branch, the synthesis updates instantly. Now I'll commit this signal on-chain — connect wallet, sign the transaction — and there it is, stored on Sepolia with the keccak256 hashes. Anyone can recompute and verify.

---

## SLIDE 6 — BLOCKCHAIN USAGE (30 seconds)

**Cosmic Commitment Registry — Solidity smart contract on Sepolia**

- **Contract:** [`0x86c3...5F77`](https://sepolia.etherscan.io/address/0x86c3783e211b7FCfB93aEd47F0e030BFb4c85F77#code) (verified on Etherscan)
- **What it stores:** `cosmologyHash` + `reasoningHash` (keccak256), bias, confidence, hexagram number, moving line, timestamps, committer address
- **~148 bytes per commitment, ~40k gas**
- **Why blockchain:** Ancient oracles relied on ritual to prevent revision. This one relies on cryptography. Without on-chain commitment, a reading can be changed after the fact. The contract creates a tamper-evident, permissionless record.
- **Multi-chain ready:** Sepolia, Base Sepolia, Mainnet, Base — one env variable to switch
- **Public API:** `GET /api/oracle` returns signal + hashes for external integrations

*Speaking notes (~75 words):*
> The Cosmic Commitment Registry is a minimal Solidity contract deployed and verified on Sepolia. Each commitment stores two keccak256 hashes — one for the cosmology data, one for the reasoning synthesis — plus readable signal data, all in about 148 bytes at roughly 40k gas. Why blockchain specifically? Ancient oracles used ritual and witnesses to prevent revision. This one uses cryptography. The computation is deterministic — the algorithm IS the oracle. The contract stores proof, not relayed data. It's also multi-chain ready and has a public REST API.

---

## SLIDE 7 — ROADMAP & WHAT'S NEXT (30 seconds)

*Speaking notes (~75 words):*
> Three next steps. First, mainnet on Base L2 for lower gas. Second, connect Pix — last year's winning agent — as a consumer of this oracle. She already interprets research through the I Ching and persists to OriginTrail. Now she can read the on-chain signal and factor it into her interpretations, closing the loop between AI and on-chain cosmology. Third, pluggable reasoning branches — Feng Shui, BaZi, Qi Men Dun Jia — the architecture already supports it, just more branches in the graph.

**Roadmap bullets for the slide:**
- **Mainnet on Base L2** — Production deployment, lower gas
- **Connect Pix** — Last year's winning agent becomes a consumer of this oracle, closing the loop between AI interpretation and on-chain signal
- **SDK / npm package** — Computation engine as a standalone library for other builders
- **Pluggable branches** — Feng Shui (地理), BaZi (八字命理), Qi Men Dun Jia (奇門遁甲) as new reasoning modules

---

## Q&A PREP (1 minute)

**"Is this serious / useful?"**
> The computation is rigorous — VSOP87 is NASA-grade, the hexagram algorithm is Shao Yong's exact method from 960 CE. Whether you believe in the signal is your choice — that's the point. The reasoning graph makes your epistemological choices explicit rather than hidden.

**"How is this different from Chainlink?"**
> Chainlink relays external data you can't verify without the same source. This oracle is deterministic — the algorithm IS the data source. The contract stores proof of computation, not relayed information.

**"Why not just use a database?"**
> A database can be edited. The commitment registry is tamper-evident and permissionless. Anyone can commit, anyone can verify. That's the value blockchain adds.

**"Business model?"**
> Open-source infrastructure. Revenue paths: premium reasoning branches, API tiers, white-label for cultural institutions.

---

## SUBMISSION CHECKLIST

- [ ] Short summary (<150 chars): `Deterministic oracle fusing 1,000 years of Chinese cosmological math with real-time astronomy, cryptographically anchored on Ethereum.`
- [ ] Full description (problems + technology)
- [ ] Technical description (SDKs: lunar-javascript, astronomy-engine, ethers.js, Hardhat, Next.js 16)
- [ ] Canva slides link
- [ ] GitHub README with:
  - [ ] Demo video
  - [ ] UI screenshots
  - [ ] Blockchain interaction description
  - [ ] Loom video with audio explaining project, repo structure, and demo
- [ ] Open source repo
