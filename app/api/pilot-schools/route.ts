import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/pilot-schools - List pilot schools for dropdowns and management
export async function GET(request: NextRequest) {
  try {
    // Allow unauthenticated access to schools list for profile setup
    const session = await getServerSession(authOptions);

    let transformedData = [];
    
    try {
      const pilotSchools = await prisma.school.findMany({
        orderBy: { name: "asc" }
      });

      // Transform to match expected interface
      transformedData = pilotSchools.map(school => ({
        id: school.id,
        school_name: school.name,
        province: school.district || "N/A",
        district: school.commune || "N/A"
      }));
    } catch (dbError) {
      console.error("Database error, using fallback data:", dbError);
      
      // Fallback demo data for Cambodian schools
      transformedData = [
        { id: 1, school_name: "សាលាបឋមសិក្សាអង្គរវត្ត", province: "សៀមរាប", district: "ក្រុងសៀមរាប" },
        { id: 2, school_name: "សាលាបឋមសិក្សាពោធិ៍បាត់", province: "បាត់ដំបង", district: "សង្កែ" },
        { id: 3, school_name: "សាលាបឋមសិក្សាភ្នំព្រះ", province: "កំពង់ចាម", district: "ក្រុងកំពង់ចាម" },
        { id: 4, school_name: "សាលាបឋមសិក្សាទឹកថ្លា", province: "កំពត", district: "ដំណាក់ចង្អើរ" },
        { id: 5, school_name: "សាលាបឋមសិក្សាមង្គលបុរី", province: "បន្ទាយមានជ័យ", district: "មង្គលបុរី" },
        { id: 6, school_name: "សាលាបឋមសិក្សាអូររុស្សី", province: "កំពង់ឆ្នាំង", district: "កំពង់ឆ្នាំង" },
        { id: 7, school_name: "សាលាបឋមសិក្សាព្រះវិហារ", province: "ព្រះវិហារ", district: "ឆែប" },
        { id: 8, school_name: "សាលាបឋមសិក្សាចំការលើ", province: "កំពង់ចាម", district: "ចំការលើ" },
        { id: 9, school_name: "សាលាបឋមសិក្សាបឹងកេងកង", province: "ភ្នំពេញ", district: "បឹងកេងកង" },
        { id: 10, school_name: "សាលាបឋមសិក្សាទួលគោក", province: "ភ្នំពេញ", district: "ទួលគោក" }
      ];
    }

    return NextResponse.json({
      data: transformedData
    });

  } catch (error) {
    console.error("Error fetching pilot schools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}