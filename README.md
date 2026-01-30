# PrivCaster 🕵️‍♂️🔒

**Privacy-First Decentralized Social Network on Aleo**

[![Aleo](https://img.shields.io/badge/Built%20on-Aleo-00D1FF?style=for-the-badge&logo=aleo&logoColor=white)](https://aleo.org)
[![Leo](https://img.shields.io/badge/Leo-v1.0+-blueviolet?style=for-the-badge)](https://github.com/AleoHQ/leo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Aleo Testnet](https://img.shields.io/badge/Status-Testnet-green?style=for-the-badge)](https://your-demo-url.vercel.app)
[![Discord](https://img.shields.io/badge/Discord-Invite-blue?style=for-the-badge&logo=discord)](https://discord.gg/your-invite-link) <!-- Replace if you create one -->

PrivCaster is a **truly private decentralized social protocol** built natively on **Aleo** using the Leo programming language and Aleo's zero-knowledge record model.

It enables users to:
- Post content (casts) without exposing identity, metadata, or connections
- Build hidden social graphs (follows, groups, interactions)
- Communicate privately via encrypted DMs and gated communities
- Receive private tips and execute bulk payouts to supporters or community members — all verifiably private

## 📡 Deployed Contract

**privcaster_v2.aleo** is now live on Aleo Testnet!

- **Contract**: `privcaster_v2.aleo`
- **Network**: Testnet
- **Transaction**: [`at1z6sgscd2n2nkkfstffww9mhf656t9hlrlpa5fh9985mxdtd59syqufjqk8`](https://explorer.aleo.org/transaction/at1z6sgscd2n2nkkfstffww9mhf656t9hlrlpa5fh9985mxdtd59syqufjqk8)
- **Deployment Cost**: 7.36 credits
- **Architecture**: Mapping-based (no record-passing required!)


Every action is protected by zero-knowledge proofs: validity is proven without revealing underlying data. This creates a safe space for authentic expression, free from doxxing, harassment, bullying, surveillance, or chain analysis — especially critical in high-risk regions and for sensitive topics.

### 🌟 Why PrivCaster Exists

On public social platforms and transparent blockchains, expressing opinions or sharing personal content carries real risks:
- Doxxing and real-world harassment
- Targeted bullying or "dragging" for unpopular views
- Self-censorship due to fear of exposure
- Traceable financial support (tips, rewards) linking wallets to identities
- Metadata leaks revealing networks, interests, and behavior patterns

PrivCaster eliminates these threats by making **privacy the default and effortless**:
- No public social graph
- No visible transaction history
- No metadata linkage between actions
- Verifiable rules (anti-spam, eligibility) without disclosure

This is only practically achievable with Aleo's programmable zero-knowledge execution environment — where private state transitions and ZK proofs are first-class citizens.

### 🎯 Core Use Cases

1. **Free Expression Without Fear**  
   Creators, activists, journalists, and everyday users post bold opinions or personal stories anonymously.

2. **Private Creator Economy**  
   Supporters tip creators or communities reward members without exposing wallets or relationships.

3. **Safe Communities**  
   Private groups for mental health support, whistleblowers, political organizing, or niche interests — membership and activity fully hidden.

4. **Bulk Private Distributions**  
   DAOs, creators, or organizers distribute rewards (airdrops, payroll-like payouts, grants) to dozens or hundreds of recipients verifiably, without revealing lists, amounts, or criteria details.

### ✨ Development Roadmap (10 Waves)

#### Wave 1 ✅ (Done / ~80% UI + private posting)
- Core frontend (wallet connect, profile view, post composer)
- Private post creation: Leo contract + ZK proof for valid posting (anti-spam/rate limit), encrypted content, hidden metadata
- Basic private feed viewer (using view keys to decrypt own posts)
- Testnet deployment + simple demo flow

#### Wave 2 🚧 (In Progress – personal interactions)
- **Private DMs**: End-to-end encrypted messaging with ZK proof of sender eligibility (e.g., mutual follow or group membership)
- **Friend requests**: ZK-based private follow requests/approvals (prove request without exposing graph)
- **Private tipping**: Single private sends (lock ALEO/stablecoin → prove balance → transfer privately to recipient)
- UI polish: Inbox, request notifications (private push via view keys), simple tip button on profiles/posts

#### Wave 3 📋 (Planned – communities + monetization start)
- **Private groups**: ZK-gated creation/joining (prove criteria like "approved by admin" or "hold reputation token" without revealing members)
- **Strict privacy in groups**: Hidden membership lists, private group posts (only visible to members via shared view keys), anti-harassment tools (e.g., private reporting with ZK proof)
- **Bulk payments foundation**: Leo contract for private pool locking + basic batch distribution proof (e.g., prove total sent matches locked amount for small batches)
- UI: Group creation/join flow, group feed, bulk payout starter interface (select recipients manually first)

#### Wave 4 📋 (Planned – reputation & anti-sybil layer)
- **Private reputation system**: Homomorphic counters for likes/reactions/follows (accumulate score privately)
- **ZK proofs for reputation**: e.g., "prove >50 engagements" to unlock features without showing exact count
- **Onboarding fee implementation**: ~$5 private payment to register → reduces bots/sybil attacks
- UI: Reputation badge display (selective), fee payment flow during signup

#### Wave 5 📋 (Planned – advanced bulk payouts - core differentiator)
- **Full private bulk payouts**: Lock funds → define private criteria (e.g., "active in last 30d", "in group X", "reputation > threshold") → ZK-proof eligibility + fair distribution → batch execute (up to 50–100 recipients)
- **Claim mechanism**: Recipients prove eligibility privately to claim their share
- **Refund/dispute logic**: Private arbitration stub
- UI: Creator dashboard for payout campaigns (select criteria, preview, execute)

#### Wave 6 📋 (Planned – selective disclosure & compliance hooks)
- **Advanced selective disclosure**: Users prove attributes (e.g., "in group Y", "reputation tier") for access gating without full reveal
- **View key sharing**: Easy UI to grant temporary access (e.g., share a post/DM with someone)
- **Basic compliance features**: Optional view key escrow for audits (tax/reporting) while keeping default private
- UI: Proof generator UI, share modal

#### Wave 7 📋 (Planned – feed & discovery improvements)
- **Private personalized feeds**: Aggregate follows + groups privately (ZK membership proofs for inclusion)
- **Basic search/discovery**: ZK-secure keyword search over encrypted posts (if feasible) or tag-based private channels
- **Notifications**: Private, encrypted push for DMs, mentions, tips received
- Mobile responsiveness + basic PWA support

#### Wave 8 📋 (Planned – monetization & economy polish)
- **Protocol fees**: 0.5% auto-collected on tips/bulk payouts → private treasury record
- **Premium features stub**: e.g., advanced ZK proofs or custom group themes (subscription via private recurring payment)
- **Analytics dashboard (private views)**: Creator sees own engagement/tip stats without leaks
- UI: Earnings overview, fee transparency notice

#### Wave 9 📋 (Planned – security, optimization & testing)
- **Circuit optimizations**: Reduce proof generation time (<5–10s target)
- **End-to-end testing**: Multi-user simulations (private interactions, payouts)
- **Basic security review**: Fuzz inputs, check common ZK pitfalls
- **Beta invite system**: Onboarding with referral codes (private)
- Prepare mainnet migration docs

#### Wave 10 📋 (Planned – mainnet launch & polish)
- **Mainnet deployment** of core contracts + frontend
- **Security audit** coordination (or self-audit report)
- **User onboarding campaign**: Landing page, demo videos, community beta invites
- **Final UX refinements**: Error handling, loading states, dark mode
- Post-launch metrics tracking (private analytics)

### 🛠 Technology Stack

| Layer              | Technology                          | Purpose                                      |
|--------------------|-------------------------------------|----------------------------------------------|
| Blockchain         | Aleo                                | Private-by-default records & transitions     |
| Smart Contracts    | Leo                                 | ZK circuits for proofs & private logic       |
| Frontend           | React / Vite / Tailwind             | Intuitive UI with automatic proof generation |
| Wallet Integration | Aleo Wallet Adapter                 | Seamless connect & sign                      |
| Privacy Primitives | ZK proofs, view keys, homomorphic counters | Hide graph, content, payments, metadata      |

### 🚀 Quick Start (Local Development)

#### Prerequisites
- Node.js ≥ 18
- [Aleo SDK & Leo CLI](https://developer.aleo.org/getting-started/install) installed
- Rust (required by Leo)
- Aleo Wallet (Leo Wallet browser extension recommended)

#### Clone & Setup
```bash
git clone https://github.com/YOUR_USERNAME/privcaster.git
cd priv_cast
npm install
```

#### View Deployed Contract
The contract is **already deployed** to Aleo testnet as `privcaster_v1.aleo`

```bash
# View contract code
cd contracts/privcaster
cat src/main.leo

# Build locally (optional)
leo build
```

#### Launch Frontend
```bash
# From project root
npm run dev
```

→ Open http://localhost:5173

#### Try It Out
1. **Connect Wallet**: Click "Connect Wallet" and select your Aleo wallet
2. **Get Testnet Credits**: Visit [Aleo Faucet](https://faucet.aleo.org/) if needed
3. **Create Group**: Go to Groups page → Create your first private group
4. **Post Privately**: Write and post with privacy features
5. **Tip Posts**: Click tip button on any post

### 📊 Live Demo & Testnet

- **Program ID**: `privcaster_v1.aleo`
- **Transaction**: [View Deployment](https://explorer.aleo.org/transaction/at1tqar505gk8x7wrsuyx4pc7cdmhyfdh7knlvtg7ktq08wur4c0gxq6ghvky)
- **Aleo Explorer**: [View Contract](https://explorer.aleo.org/program/privcaster_v1.aleo)
- **Network**: Aleo Testnet

🤝 Contributing
We welcome contributions — especially from the Aleo community, ZK developers, UI/UX designers, and privacy advocates.

Fork the repository
Create your feature branch (git checkout -b feat/private-bulk-payouts)
Commit your changes (git commit -m 'Add ZK bulk payout circuit')
Push to the branch (git push origin feat/private-bulk-payouts)
Open a Pull Request

Please read CONTRIBUTING.md for full guidelines, code style, and issue templates.
📜 License
MIT © 2026 PrivCaster Team
❤️ Built For
A more private, authentic internet — where people can speak freely, support each other safely, and build communities without fear.
If you believe privacy should be the default in social networking, star ⭐ this repo!
Made with ❤️ during the Aleo Privacy Buildathon.
text### Tips for Next Steps
- Replace placeholders (your GitHub username, demo URL, Discord link, etc.)
- Add real screenshots to the repo (e.g. in `/public/screenshots/`) and update image paths
- Create empty placeholder files: `DEVELOPMENT.md`, `CONTRIBUTING.md`
- Add a `LICENSE` file with MIT text
- When you have a live demo, update the badge and link

This version is clean, focused, detailed, and optimized to impress buildathon judges by emphasizing Aleo-native privacy innovation. Let me know if you want sections expanded (e.g. more technical depth on ZK circuits) or a matching `DEVELOPMENT.md` file!1.4sFast

privcaster_v1.aleo is now live on Aleo testnet!

Transaction: https://explorer.aleo.org/transaction/at1tqar505gk8x7wrsuyx4pc7cdmhyfdh7knlvtg7ktq08wur4c0gxq6ghvky

📡 Broadcasting deployment for privcaster_v2.aleo...
💰Your current public balance is 22.65341 credits.

✔ This transaction will cost you 7.359829 credits. Do you want to proceed? · yes

✉️ Broadcasted transaction with:
  - transaction ID: 'at1z6sgscd2n2nkkfstffww9mhf656t9hlrlpa5fh9985mxdtd59syqufjqk8'
  - fee ID: 'au1gvmacpw668mr894yxp0qx7e9njwgz7mzt433k56pz3xmq9f0jqpqg0z54x'
  - fee transaction ID: 'at1gl9kq5vl3mg3nqcu8kasn4kv748kt8trkr8v9pcv4lkhhmqjac8sl42xjt'
    (use this to check for rejected transactions)

🔄 Searching up to 12 blocks to confirm transaction (this may take several seconds)...
Explored 1 blocks.
Transaction accepted.
✅ Deployment confirmed!