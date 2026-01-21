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
  // Server-side validation
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
    const response = await publicApi.message.postMessages({
      data: {
        type: "dmca",
        subject: `DMCA Request from ${data.fullName}`,
        content: `
Content: ${data.content}
Copyright Type: ${data.copyrightType}
Email: ${data.email}
Full Name: ${data.fullName}
        `.trim(),
        state: "pending",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return { success: true };
    }

    return { success: false, error: "Failed to submit request" };
  } catch (error) {
    console.error("DMCA submission error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// app/actions/messages.ts (add below submitDMCA)

export type ContactFormData = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export async function submitContact(
  data: ContactFormData,
): Promise<ActionResponse> {
  // Server-side validation
  if (!data.name?.trim()) {
    return { success: false, error: "Name is required" };
  }
  if (!data.email?.trim()) {
    return { success: false, error: "Email is required" };
  }
  if (!data.message?.trim()) {
    return { success: false, error: "Message is required" };
  }

  try {
    const response = await publicApi.message.postMessages({
      data: {
        type: "contact",
        subject: data.subject?.trim() || `Contact from ${data.name}`,
        content: `
Name: ${data.name}
Email: ${data.email}
${data.subject ? `Subject: ${data.subject}` : ""}
Message: ${data.message}
        `.trim(),
        state: "pending",
      },
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
