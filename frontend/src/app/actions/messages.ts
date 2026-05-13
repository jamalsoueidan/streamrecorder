"use server";

import publicApi from "@/lib/public-api";

export type DMCAFormData = {
  workDescription: string;
  infringingUrls: string;
  copyrightType: string;
  firstName: string;
  lastName: string;
  email: string;
  signature: string;
  signatureDate: string;
  locale: string;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function submitDMCA(data: DMCAFormData): Promise<ActionResponse> {
  if (!data.workDescription?.trim()) {
    return { success: false, error: "Description of the work is required" };
  }
  if (!data.infringingUrls?.trim()) {
    return { success: false, error: "Infringing URLs are required" };
  }
  if (!data.copyrightType) {
    return { success: false, error: "Copyright type is required" };
  }
  if (!data.firstName?.trim() || !data.lastName?.trim()) {
    return { success: false, error: "First and last name are required" };
  }
  if (!data.email?.trim()) {
    return { success: false, error: "Email is required" };
  }
  const expectedSignature = `${data.firstName.trim()} ${data.lastName.trim()}`;
  if (
    data.signature?.trim().toLowerCase() !== expectedSignature.toLowerCase()
  ) {
    return {
      success: false,
      error: "Signature must match First and Last name",
    };
  }

  const fullName = expectedSignature;
  const subject = `DMCA Request from ${fullName}`;
  const content = [
    `Copyright role: ${data.copyrightType === "personal" ? "Copyright owner" : "Authorized representative"}`,
    `Signer: ${fullName}`,
    `Email: ${data.email}`,
    `Locale: ${data.locale}`,
    `Signed (typed): ${data.signature}`,
    `Date signed: ${data.signatureDate}`,
    "",
    "--- Description of copyrighted work ---",
    data.workDescription.trim(),
    "",
    "--- Infringing URLs (one per line) ---",
    data.infringingUrls.trim(),
  ].join("\n");

  try {
    await publicApi.report.postReports({
      data: {
        type: "dmca",
        subject,
        content,
        email: data.email,
        fullName,
        state: "pending",
      },
    });

    await publicApi.email.sendEmail({
      name: fullName,
      email: data.email,
      subject,
      message: content,
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
