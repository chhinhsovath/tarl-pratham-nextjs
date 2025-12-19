/**
 * STANDARDIZED SCHOOL DATA ACCESS
 * ================================
 * 
 * This file provides a single, consistent way to access school data.
 * ALWAYS use pilot_schools as the primary source for TaRL application.
 * 
 * Rule: If you need school data, import from this file.
 */

import { prisma } from "@/lib/prisma";

export interface StandardSchool {
  id: number;
  school_name: string;
  school_code?: string;
  province: string;
  district: string;
  cluster?: string;
  cluster_id?: number;
}

/**
 * Get all pilot schools (PREFERRED METHOD)
 * Use this for dropdowns, lists, and any school selection
 */
export async function getAllPilotSchools(): Promise<StandardSchool[]> {
  try {
    const schools = await prisma.pilot_schools.findMany({
      orderBy: { school_name: "asc" }
    });

    return schools.map(school => ({
      id: school.id,
      school_name: school.school_name,
      school_code: school.school_code || undefined,
      province: school.province || "N/A",
      district: school.district || "N/A",
      cluster: school.cluster || undefined,
      cluster_id: school.cluster_id || undefined,
    }));
  } catch (error) {
    console.error("Error fetching pilot schools:", error);
    
    // Fallback demo data
    return [
      { id: 1, school_name: "សាលាបឋមសិក្សាអង្គរវត្ត", province: "សៀមរាប", district: "ក្រុងសៀមរាប" },
      { id: 2, school_name: "សាលាបឋមសិក្សាពោធិ៍បាត់", province: "បាត់ដំបង", district: "សង្កែ" },
      { id: 3, school_name: "សាលាបឋមសិក្សាភ្នំព្រះ", province: "កំពង់ចាម", district: "ក្រុងកំពង់ចាម" },
    ];
  }
}

/**
 * Get pilot school by ID
 */
export async function getPilotSchoolById(id: number): Promise<StandardSchool | null> {
  try {
    const school = await prisma.pilot_schools.findUnique({
      where: { id }
    });

    if (!school) return null;

    return {
      id: school.id,
      school_name: school.school_name,
      school_code: school.school_code || undefined,
      province: school.province || "N/A",
      district: school.district || "N/A",
      cluster: school.cluster || undefined,
      cluster_id: school.cluster_id || undefined,
    };
  } catch (error) {
    console.error("Error fetching pilot school:", error);
    return null;
  }
}

/**
 * Search pilot schools
 */
export async function searchPilotSchools(query: string): Promise<StandardSchool[]> {
  try {
    const schools = await prisma.pilot_schools.findMany({
      where: {
        OR: [
          { school_name: { contains: query, mode: "insensitive" } },
          { school_code: { contains: query, mode: "insensitive" } },
          { province: { contains: query, mode: "insensitive" } },
          { district: { contains: query, mode: "insensitive" } },
        ]
      },
      orderBy: { school_name: "asc" }
    });

    return schools.map(school => ({
      id: school.id,
      school_name: school.school_name,
      school_code: school.school_code || undefined,
      province: school.province || "N/A",
      district: school.district || "N/A",
      cluster: school.cluster || undefined,
      cluster_id: school.cluster_id || undefined,
    }));
  } catch (error) {
    console.error("Error searching pilot schools:", error);
    return [];
  }
}

/**
 * DEPRECATED: Only use if you absolutely need the complex school schema
 * For TaRL application, prefer pilot_schools methods above
 */
export async function getLegacySchools() {
  console.warn("⚠️  DEPRECATED: Using legacy schools table. Consider using getAllPilotSchools() instead.");
  
  try {
    return await prisma.school.findMany({
      where: { is_active: true },
      orderBy: { name: "asc" }
    });
  } catch (error) {
    console.error("Error fetching legacy schools:", error);
    return [];
  }
}