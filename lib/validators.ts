import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const signupSchema = z
  .object({
    fullName: z.string().min(2).max(50),
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Trips ────────────────────────────────────────────────────────────────────

export const tripSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  visibility: z.enum(["PRIVATE", "PUBLIC"]).default("PRIVATE"),
  tags: z.array(z.string().max(30)).max(10).default([]),
}).refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const tripStopSchema = z.object({
  cityId: z.string().cuid(),
  order: z.number().int().min(0),
  arrivalDate: z.string().datetime().optional(),
  departureDate: z.string().datetime().optional(),
  hotelName: z.string().max(100).optional(),
  hotelAddress: z.string().max(200).optional(),
  hotelCostPerNight: z.number().min(0).max(99999).optional(),
  transportType: z.enum(["FLIGHT","TRAIN","BUS","CAR","SHIP","OTHER"]).optional(),
  transportNotes: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  budgetEstimate: z.number().min(0).max(999999).optional(),
});

export const reorderStopsSchema = z.object({
  orderedIds: z.array(z.string().cuid()).min(1).max(50),
});

// ─── Expenses ─────────────────────────────────────────────────────────────────

const ISO_4217 = ["USD","EUR","GBP","INR","JPY","AUD","CAD","SGD","AED","THB","CHF","MXN","BRL","ZAR","CNY","HKD","SEK","NOK","DKK","NZD"];

export const expenseSchema = z.object({
  category: z.enum(["HOTEL","TRANSPORT","FOOD","ACTIVITIES","MISCELLANEOUS"]),
  description: z.string().max(200).optional(),
  amount: z.number().positive().max(9_999_999.99),
  currency: z.string().refine((c) => ISO_4217.includes(c), { message: "Invalid currency code" }).default("USD"),
  date: z.string().datetime(),
  tripStopId: z.string().cuid().optional(),
});

// ─── Packing ──────────────────────────────────────────────────────────────────

export const packingItemSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(["CLOTHING","ELECTRONICS","ESSENTIALS","DOCUMENTS","TOILETRIES","MISCELLANEOUS"]),
  quantity: z.number().int().min(1).max(99).default(1),
  isPacked: z.boolean().optional(),
});

export const packingTemplateSchema = z.object({
  template: z.enum(["BEACH","BUSINESS","ADVENTURE","WINTER"]),
});

// ─── Notes ────────────────────────────────────────────────────────────────────

export const noteSchema = z.object({
  title: z.string().min(1).max(150),
  content: z.string().min(1).max(50000),
  type: z.enum(["TRIP","DAILY","GENERAL"]).default("GENERAL"),
  tripId: z.string().cuid().optional(),
});

// ─── Profile ──────────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(50).optional(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).optional(),
  bio: z.string().max(300).optional(),
  travelStyle: z.string().max(50).optional(),
  favoriteDestinations: z.array(z.string().max(50)).max(20).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
