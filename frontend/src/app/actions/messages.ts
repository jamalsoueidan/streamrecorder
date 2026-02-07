"use server";

import publicApi from "@/lib/public-api";

export type DMCAFormData = {
  content: string;
  copyrightType: string;
  email: string;
  fullName: string;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function submitDMCA(data: DMCAFormData): Promise<ActionResponse> {
  if (!data.content?.trim()) {
    return { success: false, error: "Content is required" };
  }
  if (!data.copyrightType) {
    return { success: false, error: "Copyright type is required" };
  }
  if (!data.email?.trim()) {
    return { success: false, error: "Email is required" };
  }
  if (!data.fullName?.trim()) {
    return { success: false, error: "Full name is required" };
  }

  try {
    // Save to database
    await publicApi.report.postReports({
      data: {
        type: "dmca",
        subject: `DMCA Request from ${data.fullName}`,
        content:
          `Copyright Type: ${data.copyrightType}\nContent: ${data.content}`.trim(),
        email: data.email,
        fullName: data.fullName,
        state: "pending",
      },
    });

    // Send email notification
    await publicApi.email.sendEmail({
      name: data.fullName,
      email: data.email,
      subject: `DMCA Request from ${data.fullName}`,
      message:
        `Copyright Type: ${data.copyrightType}\nContent: ${data.content}`.trim(),
    });

    return { success: true };
  } catch (error) {
    console.error("DMCA submission error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export type ContactFormData = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export async function submitContact(
  data: ContactFormData,
): Promise<ActionResponse> {
  if (!data.name?.trim()) {
    return { success: false, error: "Name is required" };
  }
  if (!data.email?.trim()) {
    return { success: false, error: "Email is required" };
  }
  if (!data.subject?.trim()) {
    return { success: false, error: "Subject is required" };
  }
  if (!data.message?.trim()) {
    return { success: false, error: "Message is required" };
  }

  try {
    const response = await publicApi.email.sendEmail({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    if (response.status >= 200 && response.status < 300) {
      return { success: true };
    }

    return { success: false, error: "Failed to submit message" };
  } catch (error) {
    console.error("Contact submission error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
