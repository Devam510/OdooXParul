import { prisma } from '../lib/prisma';

const citiesData = [
  {
    name: "Paris",
    country: "France",
    description: "The city of light, known for its cafe culture, Eiffel Tower, and the Louvre.",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tokyo",
    country: "Japan",
    description: "A bustling metropolis blending the ultramodern and the traditional.",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "New York City",
    country: "USA",
    description: "The Big Apple, featuring iconic skyscrapers, Broadway, and Central Park.",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Rome",
    country: "Italy",
    description: "The Eternal City, home to ancient ruins like the Colosseum and the Roman Forum.",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    description: "A port city on South Africa's southwest coast, beneath Table Mountain.",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80",
  }
];

const activitiesData = [
  {
    name: "Eiffel Tower Tour",
    category: "sightseeing",
    durationMinutes: 120,
    estimatedCost: 30,
    cityName: "Paris"
  },
  {
    name: "Louvre Museum Visit",
    category: "culture",
    durationMinutes: 240,
    estimatedCost: 20,
    cityName: "Paris"
  },
  {
    name: "Tsukiji Outer Market",
    category: "food",
    durationMinutes: 90,
    estimatedCost: 40,
    cityName: "Tokyo"
  },
  {
    name: "Senso-ji Temple",
    category: "culture",
    durationMinutes: 60,
    estimatedCost: 0,
    cityName: "Tokyo"
  },
  {
    name: "Broadway Show",
    category: "nightlife",
    durationMinutes: 150,
    estimatedCost: 150,
    cityName: "New York City"
  },
  {
    name: "Central Park Bike Tour",
    category: "adventure",
    durationMinutes: 120,
    estimatedCost: 45,
    cityName: "New York City"
  },
  {
    name: "Colosseum Underground Tour",
    category: "sightseeing",
    durationMinutes: 180,
    estimatedCost: 35,
    cityName: "Rome"
  },
  {
    name: "Vatican Museums",
    category: "culture",
    durationMinutes: 240,
    estimatedCost: 25,
    cityName: "Rome"
  },
  {
    name: "Table Mountain Cable Car",
    category: "sightseeing",
    durationMinutes: 120,
    estimatedCost: 20,
    cityName: "Cape Town"
  },
  {
    name: "Boulders Beach Penguins",
    category: "nature",
    durationMinutes: 90,
    estimatedCost: 10,
    cityName: "Cape Town"
  }
];

async function main() {
  console.log('Start seeding...');
  
  // Clear existing to prevent duplicates
  await prisma.activity.deleteMany({});
  await prisma.city.deleteMany({});
  
  for (const cityData of citiesData) {
    const city = await prisma.city.create({
      data: cityData,
    });
    console.log(`Created city: ${city.name}`);
    
    const cityActivities = activitiesData.filter(a => a.cityName === city.name);
    for (const act of cityActivities) {
      await prisma.activity.create({
        data: {
          name: act.name,
          category: act.category.toUpperCase() as any,
          durationMins: act.durationMinutes,
          estimatedCost: act.estimatedCost,
          cityId: city.id,
        }
      });
      console.log(`  - Added activity: ${act.name}`);
    }
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
