import Robots from '../models/Robots.model';

const sampleRobots = [
  {
    name: "Invoice Processor",
    status: true,
  },
  {
    name: "Customer Onboarding Bot",
    status: true,
  },
  {
    name: "Data Extractor",
    status: false,
  },
  {
    name: "Email Classifier",
    status: true,
  },
  {
    name: "Report Generator",
    status: false,
  }
];

export async function seedRobots() {
  try {
    // Check if we already have robots
    const count = await Robots.count();
    
    if (count === 0) {
      // Only seed if no robots exist
      await Robots.bulkCreate(sampleRobots);
      console.log('Sample robots have been added to the database');
    } else {
      console.log('Database already has robots, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding robots:', error);
  }
} 