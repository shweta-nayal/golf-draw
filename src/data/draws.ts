import prizeCar from "@/assets/prize-car.jpg";
import prizeVilla from "@/assets/prize-villa.jpg";
import prizeCash from "@/assets/prize-cash.jpg";
import prizeWatch from "@/assets/prize-watch.jpg";

export type Draw = {
  id: string;
  title: string;
  prize: string;
  image: string;
  ticketPrice: number;
  ticketsSold: number;
  ticketsTotal: number;
  endsAt: string; // ISO
  cause: string;
  causeShort: string;
  causePercent: number;
};

const inDays = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

export const draws: Draw[] = [
  {
    id: "aston-vantage",
    title: "Black Aston Vantage",
    prize: "2025 Aston Martin Vantage",
    image: prizeCar,
    ticketPrice: 10,
    ticketsSold: 18420,
    ticketsTotal: 25000,
    endsAt: inDays(6),
    cause: "Funds clean cookstoves & solar lamps for 4,000 families across East Africa.",
    causeShort: "Clean energy access",
    causePercent: 80,
  },
  {
    id: "maldives-villa",
    title: "Private Maldives Villa",
    prize: "7 nights · overwater villa for two",
    image: prizeVilla,
    ticketPrice: 5,
    ticketsSold: 12100,
    ticketsTotal: 20000,
    endsAt: inDays(12),
    cause: "Provides scholarships & school meals for 1,200 girls in rural Kenya.",
    causeShort: "Education for girls",
    causePercent: 75,
  },
  {
    id: "cash-100k",
    title: "£100,000 Tax-Free Cash",
    prize: "£100,000 paid directly to the winner",
    image: prizeCash,
    ticketPrice: 25,
    ticketsSold: 6800,
    ticketsTotal: 12000,
    endsAt: inDays(3),
    cause: "Builds two community wells serving 8,500 people in Malawi.",
    causeShort: "Clean water wells",
    causePercent: 70,
  },
  {
    id: "gold-watch",
    title: "Heritage Gold Chronograph",
    prize: "18k gold automatic timepiece",
    image: prizeWatch,
    ticketPrice: 15,
    ticketsSold: 3200,
    ticketsTotal: 8000,
    endsAt: inDays(18),
    cause: "Funds mobile health clinics serving 15,000 patients each year.",
    causeShort: "Mobile health clinics",
    causePercent: 78,
  },
];

export const winners = [
  { name: "Amelia R.", location: "Bristol, UK", prize: "£50,000 Cash", date: "Mar 2026", cause: "Reforestation in the Amazon" },
  { name: "Daniel K.", location: "Toronto, CA", prize: "Tesla Model Y",  date: "Feb 2026", cause: "Refugee education programmes" },
  { name: "Priya S.", location: "Singapore",   prize: "Bali Retreat",   date: "Jan 2026", cause: "Mental health helplines" },
  { name: "Marco B.", location: "Milan, IT",   prize: "Rolex Submariner",date: "Dec 2025", cause: "Ocean plastic clean-ups" },
];

export const impactStats = [
  { value: "£12.4M", label: "Raised for charity" },
  { value: "284", label: "Causes funded" },
  { value: "1,920", label: "Lives changed" },
  { value: "76%", label: "Avg. donation share" },
];
