import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb/connect";
import Complaint, { IComplaint } from "@/models/Complaint";
import { sendComplaintEmail } from "@/services/emailService";

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = params;
  try {
    await connectDB();

    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { message: "Status field is required for update." },
        { status: 400 }
      );
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status, dateSubmitted: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return NextResponse.json(
        { message: "Complaint nt found." },
        { status: 404 }
      );
    }

    sendComplaintEmail("STATUS_UPDATE", updatedComplaint);

    return NextResponse.json(updatedComplaint, { status: 200 });
  } catch (error: unknown) {
    console.error(`PATCH /api/complaints/${id} Error:`, error);
    let errorMessage = "An unknown server error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Failed to update complaints", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(id);
    if (!deletedComplaint) {
      return NextResponse.json(
        { message: "Complaint not found." },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error(`DELETE /api/complaints/${id} Error:`, error);
    let errorMessage = "An unknown server error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Failed to Delete complaints", error: errorMessage },
      { status: 500 }
    );
  }
}
