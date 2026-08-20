/**
 * SiraHub database seed script.
 *
 * Populates the database with:
 * - 18 Ethiopian job market categories
 * - ~90 skills mapped to their categories
 *
 * Usage:
 *   npx ts-node src/seed.ts
 *
 * Safe to run multiple times — uses upsert on slug to avoid duplicates.
 */

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import mongoose from 'mongoose';
import { env } from './config/env';
import slugify from './utils/slugify';
import Category, { ICategoryDocument } from './models/Category';
import Skill from './models/Skill';

// ─── Seed data ────────────────────────────────────────────────────────────────

interface SeedCategory {
  name: string;
  description: string;
  icon: string;
  skills: string[];
}

const SEED_CATEGORIES: SeedCategory[] = [
  {
    name: 'Software & IT',
    description: 'Software engineering, web development, mobile apps, DevOps, data, AI/ML',
    icon: 'code-2',
    skills: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js',
      'Next.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'Docker', 'Kubernetes', 'AWS', 'Git', 'REST APIs', 'GraphQL',
      'React Native', 'Flutter', 'Machine Learning', 'Data Science',
    ],
  },
  {
    name: 'Finance & Accounting',
    description: 'Accounting, auditing, financial analysis, taxation, treasury',
    icon: 'calculator',
    skills: [
      'Financial Reporting', 'IFRS', 'Tax Compliance', 'Budgeting',
      'Internal Audit', 'QuickBooks', 'SAP Finance', 'Excel', 'Cost Accounting',
    ],
  },
  {
    name: 'Healthcare & Medical',
    description: 'Medicine, nursing, pharmacy, public health, clinical services',
    icon: 'heart-pulse',
    skills: [
      'Patient Care', 'Clinical Diagnosis', 'Pharmacy', 'Public Health',
      'Nursing', 'Medical Research', 'Epidemiology', 'Surgical Assistance',
    ],
  },
  {
    name: 'Education & Training',
    description: 'Teaching, curriculum development, academic research, tutoring',
    icon: 'graduation-cap',
    skills: [
      'Curriculum Development', 'Lesson Planning', 'E-Learning',
      'Academic Research', 'Student Assessment', 'Training Facilitation',
    ],
  },
  {
    name: 'Sales & Marketing',
    description: 'Sales, digital marketing, brand management, market research',
    icon: 'trending-up',
    skills: [
      'Digital Marketing', 'SEO', 'Social Media Marketing', 'Content Marketing',
      'Sales Strategy', 'CRM', 'Email Marketing', 'Google Ads', 'Brand Management',
    ],
  },
  {
    name: 'Engineering',
    description: 'Civil, mechanical, electrical, chemical and industrial engineering',
    icon: 'settings',
    skills: [
      'Civil Engineering', 'Structural Design', 'AutoCAD', 'Electrical Engineering',
      'Mechanical Engineering', 'Project Engineering', 'Quality Control', 'HVAC',
    ],
  },
  {
    name: 'Human Resources',
    description: 'Recruitment, talent management, employee relations, payroll',
    icon: 'users',
    skills: [
      'Recruitment', 'Employee Relations', 'Performance Management',
      'Payroll Processing', 'HRIS', 'Organizational Development', 'Labor Law',
    ],
  },
  {
    name: 'Legal',
    description: 'Corporate law, litigation, compliance, contracts, legal consulting',
    icon: 'scale',
    skills: [
      'Contract Law', 'Corporate Law', 'Litigation', 'Legal Research',
      'Compliance', 'Regulatory Affairs', 'Ethiopian Commercial Law',
    ],
  },
  {
    name: 'Construction & Real Estate',
    description: 'Building construction, real estate development, architecture, property management',
    icon: 'building-2',
    skills: [
      'Construction Management', 'Architectural Design', 'Quantity Surveying',
      'Property Valuation', 'Project Management', 'Site Supervision', 'AutoCAD',
    ],
  },
  {
    name: 'Hospitality & Tourism',
    description: 'Hotels, restaurants, travel, event management, customer service',
    icon: 'hotel',
    skills: [
      'Customer Service', 'Food & Beverage', 'Event Planning',
      'Tour Guiding', 'Hotel Management', 'Catering', 'Guest Relations',
    ],
  },
  {
    name: 'NGO & Development',
    description: 'Non-governmental organizations, development projects, humanitarian work',
    icon: 'heart-handshake',
    skills: [
      'Project Management', 'Grant Writing', 'M&E', 'Community Development',
      'WASH', 'Food Security', 'Humanitarian Aid', 'Report Writing',
    ],
  },
  {
    name: 'Government & Public Sector',
    description: 'Federal and regional government offices, public administration, policy',
    icon: 'landmark',
    skills: [
      'Public Administration', 'Policy Analysis', 'Government Procurement',
      'Civil Service', 'Report Writing', 'Amharic Proficiency',
    ],
  },
  {
    name: 'Media & Communications',
    description: 'Journalism, broadcasting, public relations, advertising, content creation',
    icon: 'radio',
    skills: [
      'Journalism', 'Broadcast Production', 'Public Relations', 'Copywriting',
      'Video Production', 'Photography', 'Social Media Management',
    ],
  },
  {
    name: 'Transport & Logistics',
    description: 'Freight, supply chain, fleet management, customs, warehouse',
    icon: 'truck',
    skills: [
      'Supply Chain Management', 'Freight Forwarding', 'Customs Clearance',
      'Fleet Management', 'Warehouse Management', 'Logistics Planning',
    ],
  },
  {
    name: 'Agriculture',
    description: 'Farming, agribusiness, agronomy, livestock, food processing',
    icon: 'sprout',
    skills: [
      'Agronomy', 'Crop Production', 'Livestock Management', 'Irrigation',
      'Agribusiness', 'Food Safety', 'Agricultural Extension',
    ],
  },
  {
    name: 'Manufacturing',
    description: 'Factory operations, production management, quality assurance',
    icon: 'factory',
    skills: [
      'Production Management', 'Quality Assurance', 'Lean Manufacturing',
      'Equipment Maintenance', 'Safety Management', 'Six Sigma',
    ],
  },
  {
    name: 'Banking & Insurance',
    description: 'Commercial banking, microfinance, insurance, investment',
    icon: 'banknote',
    skills: [
      'Credit Analysis', 'Loan Processing', 'Anti-Money Laundering',
      'Insurance Underwriting', 'Treasury Management', 'Risk Assessment',
      'Core Banking Systems',
    ],
  },
  {
    name: 'Consulting',
    description: 'Business consulting, management advisory, strategy, research',
    icon: 'briefcase',
    skills: [
      'Business Analysis', 'Strategy Consulting', 'Change Management',
      'Process Improvement', 'Market Research', 'Management Advisory',
    ],
  },
];

// ─── Seed function ────────────────────────────────────────────────────────────

async function seed(): Promise<void> {
  console.log('🌱 Starting seed...');

  await mongoose.connect(env.MONGODB_URI, { dbName: 'sirahub' });
  console.log('✅ Connected to MongoDB');

  let categoriesCreated = 0;
  let categoriesSkipped = 0;
  let skillsCreated = 0;
  let skillsSkipped = 0;

  for (const catData of SEED_CATEGORIES) {
    const slug = slugify(catData.name);

    // Upsert category
    const existingCat = await Category.exists({ slug });
    const category = await Category.findOneAndUpdate(
      { slug },
      {
        $setOnInsert: {
          name: catData.name,
          slug,
          description: catData.description,
          icon: catData.icon,
          jobCount: 0,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    ) as ICategoryDocument;

    if (!existingCat) {
      categoriesCreated++;
    } else {
      categoriesSkipped++;
    }

    // Upsert each skill for this category
    for (const skillName of catData.skills) {
      const skillSlug = slugify(skillName);
      const existingSkill = await Skill.exists({ slug: skillSlug });
      await Skill.findOneAndUpdate(
        { slug: skillSlug },
        {
          $setOnInsert: {
            name: skillName,
            slug: skillSlug,
            category: category._id,
            isActive: true,
          },
        },
        { upsert: true, new: true }
      );

      if (!existingSkill) {
        skillsCreated++;
      } else {
        skillsSkipped++;
      }
    }

    console.log(`  ✓ Category: ${catData.name} — ${catData.skills.length} skills`);
  }

  console.log('\n─── Seed Summary ─────────────────────────────────────');
  console.log(`Categories: ${categoriesCreated} created, ${categoriesSkipped} already existed`);
  console.log(`Skills:     ${skillsCreated} created, ${skillsSkipped} already existed`);
  console.log('─────────────────────────────────────────────────────\n');

  await mongoose.connection.close();
  console.log('✅ Database connection closed. Seed complete.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
