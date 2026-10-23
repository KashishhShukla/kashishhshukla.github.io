/**
 * Portfolio Projects Data Repository - Kashish Shukla
 */
const PROJECTS_DATA = [
  {
    id: "truefit-ai",
    title: "TrueFit-AI Candidate Discovery & Ranking",
    category: "ai",
    categoryLabel: "AI & Machine Learning",
    image: "assets/images/project1.jpg",
    summary: "Intelligent candidate discovery and ranking engine evaluating up to 100,000 profiles using multi-signal scoring, TF-IDF relevance, and honeypot detection.",
    description: "TrueFit-AI is an end-to-end recruitment intelligence system built to ingest and rank candidate profiles at scale. It leverages multi-signal scoring, TF-IDF text similarity algorithms, behavioral analysis, and automated honeypot detection to eliminate anomalies and surface the highest-fit talent.",
    tech: ["Python", "scikit-learn", "NumPy", "JavaScript", "REST API", "Docker", "Render"],
    features: [
      "Evaluates and scores up to 100,000 candidate profiles with high precision",
      "Multi-signal scoring combining TF-IDF similarity vectors with behavioral indicators",
      "Honeypot and anomaly detection filters to identify fraudulent or low-signal applications",
      "Interactive analytics dashboard with custom dataset uploads and dynamic scoring weights",
      "Production-ready REST API endpoints with automated CSV export"
    ],
    stats: {
      metric1: "100k+ Profiles",
      metric2: "TF-IDF + Anomaly",
      metric3: "Multi-Signal Engine"
    },
    demoUrl: "https://truefit-ai-iiik.onrender.com",
    githubUrl: "https://github.com/KashishhShukla/TrueFit-AI"
  },
  {
    id: "multiplayer-connect4",
    title: "Multiplayer Connect 4 Real-Time Arena",
    category: "fullstack",
    categoryLabel: "Full-Stack & Real-Time",
    image: "assets/images/project2.jpg",
    summary: "Real-time competitive multiplayer game with low-latency WebSocket gameplay, Redis matchmaking queues, dynamic ELO ratings, and match persistence.",
    description: "A full-stack, distributed gaming platform allowing players worldwide to match up in real-time. Built with Socket.io WebSockets, Redis-backed matchmaking queues, PostgreSQL database persistence, match recovery algorithms, and dynamic ELO ranking adjustments.",
    tech: ["React", "Node.js", "Express.js", "Socket.io", "PostgreSQL", "Redis", "JavaScript", "Vercel", "Render"],
    features: [
      "Instant multiplayer matchmaking powered by high-throughput Redis queues",
      "Sub-millisecond gameplay state synchronization with Socket.io WebSockets",
      "Dynamic ELO rating calculation and persistent match history stored in PostgreSQL",
      "Graceful reconnection handling and integrated in-game live chat",
      "Responsive interactive board interface deployed across Vercel and Render"
    ],
    stats: {
      metric1: "Real-Time WebSockets",
      metric2: "Redis Matchmaking",
      metric3: "Dynamic ELO & Persistence"
    },
    demoUrl: "https://multiplayer-connect4-game.vercel.app",
    githubUrl: "https://github.com/KashishhShukla/Multiplayer-connect4-game"
  }
];
