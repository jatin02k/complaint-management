import nodemailer from "nodemailer";
import { IComplaint } from "@/models/Complaint";

//env var
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const ADMIN_EMAIL = process.env.EMAIL_ADMIN;

// nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// generate email content based on the event type
const generateEmailContent = (
  type: "NEW" | "STATUS_UPDATE",
  complaint: IComplaint
) => {
  const date = new Date(complaint.dateSubmitted).toLocaleString();
  let subject = "";
  let html = "";

  // --- Email for New Complaint Submission ---
  if (type === "NEW") {
    subject = `[NEW Complaint] ${complaint.title}`;
    html = `
            <h2>A New Complaint Has Been Submitted</h2>
            <p><strong>Title:</strong> ${complaint.title}</p>
            <p><strong>Category:</strong> ${complaint.category}</p>
            <p><strong>Priority:</strong> <span style="color: ${
              complaint.priority === "High"
                ? "red"
                : complaint.priority === "Medium"
                ? "orange"
                : "green"
            };">${complaint.priority}</span></p>
            <p><strong>Submitted On:</strong> ${date}</p>
            <hr>
            <h3>Description:</h3>
            <p>${complaint.description.replace(/\n/g, "<br>")}</p>
            <p>Please log in to the Admin Dashboard to review and manage this complaint.</p>
        `;
  }

  // --- Email for Status Update ---
  else if (type === "STATUS_UPDATE") {
    subject = `[Status Updated] Complaint: ${complaint.title}`;
    html = `
            <h2>Complaint Status Updated!</h2>
            <p>The status for the complaint titled <strong>"${complaint.title}"</strong> has been updated.</p>
            <p><strong>New Status:</strong> <span style="font-weight: bold; color: blue;">${complaint.status}</span></p>
            <p><strong>Update Date:</strong> ${date}</p>
            <p>Thank you for managing the complaint system.</p>
        `;
  }

  return { subject, html };
};

export const sendComplaintEmail = async (
  type: "NEW" | "STATUS_UPDATE",
  complaint: IComplaint
) => {
  if (!ADMIN_EMAIL || !EMAIL_USER) {
    console.error(
      "Email environment variables (ADMIN_EMAIL or EMAIL_USER) are missing. Skipping email."
    );
    return;
  }

  try {
    const { subject, html } = generateEmailContent(type, complaint);

    const mailOptions = {
      from: `"Complaint System" <${EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: subject,
      html: html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId} (Type: ${type})`);
  } catch (error) {
    console.error(`Failed to send ${type} email:`, error);
  }
};
