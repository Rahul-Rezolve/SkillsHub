import { SchemaType } from "@google/generative-ai";

export const extractionResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    name: { type: SchemaType.STRING },
    email: { type: SchemaType.STRING },
    title: { type: SchemaType.STRING },
    location: { type: SchemaType.STRING },
    skills: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          category: {
            type: SchemaType.STRING,
            enum: ["LANGUAGE", "FRAMEWORK", "PLATFORM", "TOOL", "DOMAIN"],
          },
          proficiency: {
            type: SchemaType.STRING,
            enum: ["NOVICE", "INTERMEDIATE", "EXPERT"],
          },
          yearsExp: { type: SchemaType.NUMBER },
        },
        required: ["name", "category", "proficiency", "yearsExp"],
      },
    },
    projects: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          role: { type: SchemaType.STRING },
          startDate: { type: SchemaType.STRING },
          endDate: { type: SchemaType.STRING },
          techStack: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: ["name", "description", "role", "startDate", "techStack"],
      },
    },
    certifications: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          issuer: { type: SchemaType.STRING },
          date: { type: SchemaType.STRING },
        },
        required: ["name"],
      },
    },
  },
  required: ["name", "email", "skills", "projects"],
};

export const inferredSkillsSchema = {
  type: SchemaType.OBJECT,
  properties: {
    inferredSkills: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          category: {
            type: SchemaType.STRING,
            enum: ["LANGUAGE", "FRAMEWORK", "PLATFORM", "TOOL", "DOMAIN"],
          },
          proficiency: {
            type: SchemaType.STRING,
            enum: ["NOVICE", "INTERMEDIATE", "EXPERT"],
          },
          yearsExp: { type: SchemaType.NUMBER },
          confidence: { type: SchemaType.NUMBER },
          reason: { type: SchemaType.STRING },
        },
        required: [
          "name",
          "category",
          "proficiency",
          "yearsExp",
          "confidence",
          "reason",
        ],
      },
    },
  },
  required: ["inferredSkills"],
};

export const searchParseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    requiredSkills: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    minYears: { type: SchemaType.NUMBER },
    location: { type: SchemaType.STRING },
    availability: { type: SchemaType.STRING },
    seniority: { type: SchemaType.STRING },
    domain: { type: SchemaType.STRING },
  },
  required: ["requiredSkills"],
};

export const searchRankingSchema = {
  type: SchemaType.OBJECT,
  properties: {
    rankings: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          employeeId: { type: SchemaType.STRING },
          score: { type: SchemaType.NUMBER },
          reasoning: { type: SchemaType.STRING },
        },
        required: ["employeeId", "score", "reasoning"],
      },
    },
  },
  required: ["rankings"],
};
