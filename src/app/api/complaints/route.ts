import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/connect";
import Complaint, { IComplaint } from "@/models/Complaint";
import { sendComplaintEmail } from "@/services/emailService";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body: Partial<IComplaint> = await request.json();

    const newComplaint = await Complaint.create(body);
    sendComplaintEmail("NEW", newComplaint as IComplaint);
    return NextResponse.json(
      { message: "Complaint submitted successfully", complaint: newComplaint },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/complaints Error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      const errors: Record<string, string> = {};
      // Iterate over validation errors safely
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return NextResponse.json(
        { message: "Validation Error", errors },
        { status: 400 }
      );
    }

    let errorMessage = "An unknown server error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: "Failed to create complaint", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const complaints = await Complaint.find({}).sort({ dateSubmitted: -1 });

    return NextResponse.json(complaints, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/complaints Error:", error);
    let errorMessage = "An unknown server error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Failed to retrieve complaints", error: errorMessage },
      { status: 500 }
    );
  }
}
