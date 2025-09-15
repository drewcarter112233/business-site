export type Service = {
  id: string
  name: string
  price: number
  description: string
  duration?: string
  disclaimer?: string
  category: string
}

export const services: Service[] = [
  // Minimum Service Charge
  {
    id: "min-service",
    name: "Minimum Service Charge",
    price: 135,
    description: "$135 minimum applies to all jobs",
    category: "base",
  },

  // Custom Cleaning
  {
    id: "custom-job",
    name: "Custom Job",
    price: 0,
    description:
      "A custom quote will be provided if your job doesn’t fall under a standard category.",
    disclaimer: "Please provide as much detail as possible, including pictures.",
    duration: "Up to 4 hours",
    category: "custom-services",
  },

  // Carpet Cleaning
  {
    id: "room-1",
    name: "1 Room",
    price: 80,
    description:
      "Schedule with us and we will clean the dirt and grime out of your carpets.  We have special equipment and preferred cleaning solution to get your floor looking clean again!",
    category: "carpet-cleaning",
    duration: "Up to 2 hours",
  },
  {
    id: "room-2",
    name: "2 Rooms",
    price: 150,
    description:
      "Schedule with us and we will clean the dirt and grime out of your carpets.  We have special equipment and preferred cleaning solution to get your floor looking clean again!",
    category: "carpet-cleaning",
    duration: "Up to 2 hours",
  },
  {
    id: "room-3",
    name: "3 Rooms",
    price: 220,
    description:
      "Schedule with us and we will clean the dirt and grime out of your carpets.  We have special equipment and preferred cleaning solution to get your floor looking clean again!",
    category: "carpet-cleaning",
    duration: "Up to 2 hours",
  },

  // Additional Cleaning
  {
    id: "loveseat",
    name: "Loveseat or Chair",
    price: 10,
    description:
      "Have you cleaned your loveseat or man chair since you bought it? Over time human oils and debris (coins, food, hair) become embedded in the upholstery. We help clean off the dirt and grime to make your man chair smell and feel new again.",
    category: "additional-cleaning",
    duration: "Up to 1 hours",
  },
  {
    id: "sofa",
    name: "Sofa",
    price: 40,
    description:
      "Have you cleaned your sofa since you bought it? Over time human oils and debris (coins, food, hair) become embedded in the upholstery. We help clean off the dirt and grime to make your sofa smell and feel new again.",
    category: "additional-cleaning",
    duration: "Up to 1 hours",
  },
  {
    id: "sectional-sofa",
    name: "Sectional Sofa",
    price: 30,
    description:
      "Have you cleaned your sectional sofa since you bought it? Over time human oils and debris (coins, food, hair) become embedded in the upholstery. We help clean off the dirt and grime to make your sectional sofa smell and feel new again.",
    category: "additional-cleaning",
    duration: "Up to 1 hours",
  },
  {
    id: "rug",
    name: "Rug",
    price: 50,
    description:
      "Get a rug cleaned for one low price.  We have special equipment and preferred cleaning solution to get your carpet looking new again.",
    category: "additional-cleaning",
    duration: "Up to 1 hours",
  },
  {
    id: "tile",
    name: "Tile",
    price: 60,
    description:
      "Cleaning technicians use special equipment, tools and techniques to clean a variety of tile. ",
    category: "additional-cleaning",
    duration: "Up to 1 hours",
  },
]

export const categories = [
  {
    id: "custom-services",
    name: "Custom Services",
    description: "Custom job",
  },
  {
    id: "carpet-cleaning",
    name: "Carpet Cleaning",
    description: "1 Room, 2 Rooms, or 3 Rooms Carpet Cleaning",
  },
  {
    id: "additional-cleaning",
    name: "Additional Cleaning",
    description: "Loveseat or Chair, Sofa, Sectional Sofa, Rug, Tile",
  },
]
