// Shared mock data. The client imports a copy of this file until a real DB exists.
export const studySets = [
  {
    id: "set-bio-101",
    title: "Cell Biology: Midterm",
    subject: "BIO 101",
    description: "Organelles, membranes, and cellular respiration.",
    examDate: "2026-10-21",
    updatedAt: "2026-10-04T10:00:00Z",
    cards: [
      { id: "c1", front: "Which organelle produces most of the cell's ATP?", back: "The mitochondrion" },
      { id: "c2", front: "What does the rough ER have that the smooth ER lacks?", back: "Ribosomes on its surface" },
      { id: "c3", front: "What is the main function of the Golgi apparatus?", back: "Modifying, sorting and packaging proteins" },
      { id: "c4", front: "Which molecule carries the cell's genetic code?", back: "DNA" },
      { id: "c5", front: "What controls what enters and leaves the cell?", back: "The plasma membrane" },
    ],
    guide: [
      { heading: "Energy", body: "Mitochondria convert glucose and oxygen into ATP through cellular respiration. Cells with high energy demands, such as muscle cells, contain many of them." },
      { heading: "Protein pathway", body: "Proteins are built on ribosomes, folded in the rough ER, then modified and shipped by the Golgi apparatus in vesicles." },
    ],
  },
  {
    id: "set-hist-210",
    title: "Industrial Revolution",
    subject: "HIST 210",
    description: "Causes, key inventions, and social effects.",
    examDate: "2026-11-03",
    updatedAt: "2026-10-01T15:30:00Z",
    cards: [
      { id: "h1", front: "Where did the Industrial Revolution begin?", back: "Great Britain" },
      { id: "h2", front: "Who improved the steam engine in the 1760s?", back: "James Watt" },
      { id: "h3", front: "What did the Luddites protest?", back: "Machines replacing skilled textile workers" },
      { id: "h4", front: "Which fuel powered early factories and railways?", back: "Coal" },
    ],
    guide: [
      { heading: "Why Britain?", body: "Coal and iron deposits, colonial markets, capital from trade, and stable institutions combined to make Britain the first industrial economy." },
    ],
  },
];
