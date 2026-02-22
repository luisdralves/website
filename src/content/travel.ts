export type TravelEntry = {
  location: string;
  country: string;
  date: string; // YYYY-MM-DD
  photos: {
    src: string;
    alt: string;
    width: number; // 0-1, fraction of page width
  }[];
  journalEntry: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export const travel = [
  {
    location: "Kyoto",
    country: "Japan",
    date: "2024-03-15",
    photos: [
      { src: "/images/travel/kyoto-1.jpg", alt: "Fushimi Inari shrine gates", width: 1 },
      { src: "/images/travel/kyoto-2.jpg", alt: "Bamboo grove at Arashiyama", width: 0.5 },
    ],
    journalEntry:
      "Wandered through thousands of vermillion torii gates at dawn. The silence was almost sacred.",
    coordinates: {
      lat: 35.0116,
      lng: 135.7681,
    },
  },
  {
    location: "Lisbon",
    country: "Portugal",
    date: "2023-09-10",
    photos: [
      { src: "/images/travel/lisbon-1.jpg", alt: "Tram 28 climbing a hill", width: 0.5 },
      { src: "/images/travel/lisbon-2.jpg", alt: "Sunset over the Tagus river", width: 0.5 },
    ],
    journalEntry:
      "Got lost in Alfama's labyrinth of streets. Found the best pastéis de nata in a bakery with no name.",
    coordinates: {
      lat: 38.7223,
      lng: -9.1393,
    },
  },
  {
    location: "Reykjavik",
    country: "Iceland",
    date: "2023-01-20",
    photos: [
      { src: "/images/travel/iceland-1.jpg", alt: "Northern lights over a frozen lake", width: 1 },
    ],
    journalEntry: "Stayed up until 3am chasing the aurora. Worth every sleepless moment.",
    coordinates: {
      lat: 64.1466,
      lng: -21.9426,
    },
  },
] as const satisfies TravelEntry[];
