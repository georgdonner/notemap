import {
  FaUtensils,
  FaCoffee,
  FaBed,
  FaStore,
  FaRunning,
  FaTree,
  FaTheaterMasks,
  FaGraduationCap,
  FaCameraRetro,
  FaCircle,
} from "react-icons/fa";

const categories = [
  {
    key: "restaurant",
    name: "Restaurant",
    icon: FaUtensils,
  },
  {
    key: "cafe",
    name: "Café",
    icon: FaCoffee,
  },
  {
    key: "accomodation",
    name: "Unterkunft",
    icon: FaBed,
  },
  {
    key: "shop",
    name: "Geschäft",
    icon: FaStore,
  },
  {
    key: "sports",
    name: "Sport",
    icon: FaRunning,
  },
  {
    key: "outdoor",
    name: "Outdoor",
    icon: FaTree,
  },
  {
    key: "culture",
    name: "Kultur",
    icon: FaTheaterMasks,
  },
  {
    key: "education",
    name: "Bildung",
    icon: FaGraduationCap,
  },
  {
    key: "sight",
    name: "Sehenswürdigkeit",
    icon: FaCameraRetro,
  },
  {
    key: "other",
    name: "Sonstiges",
    icon: FaCircle,
  },
];

export { categories };
