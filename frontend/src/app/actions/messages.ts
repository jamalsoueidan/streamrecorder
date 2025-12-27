"use server";

import api from "@/lib/api";

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
    const response = await api.message.postMessages({
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
