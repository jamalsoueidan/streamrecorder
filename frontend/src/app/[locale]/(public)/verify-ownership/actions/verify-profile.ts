"use server";

import publicApi from "@/lib/public-api";
import { setToken } from "@/lib/token";

interface VerifyProfileParams {
  profileUrl: string;
  platform: string;
  username: string;
  verificationCode: string;
  email: string;
  intent: string;
}

interface VerifyProfileResult {
  success: boolean;
  verified: boolean;
  error?: string;
  action?: "created" | "linked" | "deleted";
  deletedCount?: number;
}

// Helper to update follower ownership across all locales
async function updateFollowerOwnership(
  followerDocumentId: string,
  ownerId: string | number,
  localizations: { locale: string }[],
): Promise<void> {
  // Update main follower (default locale)
  await publicApi.follower.putFollowersId(
    { id: followerDocumentId },
    { data: { owner: ownerId } as never },
  );

  // Update all localizations
  for (const loc of localizations) {
    await publicApi.follower.putFollowersId(
      { id: followerDocumentId },
      { data: { owner: ownerId } as never },
      { query: { locale: loc.locale } } as never,
    );
  }
}

// Helper to link user to follower
async function linkUserToFollower(
  userDocumentId: string,
  username: string,
  platform: string,
): Promise<void> {
  await publicApi.follower.connectUserWithFollower(
    { userDocumentId },
    { username, type: platform as never },
  );
}

export async function verifyProfile(
  params: VerifyProfileParams,
): Promise<VerifyProfileResult> {
  const { profileUrl, platform, username, verificationCode, email, intent } =
    params;

  const n8nWebhookUrl = process.env.N8N_URL + "/webhook/browser/url";

  if (!n8nWebhookUrl) {
    return {
      success: false,
      verified: false,
      error: "Verification service not configured",
    };
  }

  try {
    // Step 1: Verify the code exists in their bio via n8n
    /*const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileUrl,
        platform,
        username,
        verificationCode,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        verified: false,
        error: "Verification service error",
      };
    }

    const result = await response.json();

    if (!result.verified) {
      return {
        success: true,
        verified: false,
      };
    }*/

    // Step 2: Find the follower by platform + username
    const followerResponse = await publicApi.follower.getFollowers({
      filters: {
        type: { $eq: platform },
        username: { $eqi: username },
      },
      populate: {
        localizations: {
          fields: "locale",
        },
      },
    });

    const follower = followerResponse.data?.data?.[0];

    if (!follower || !follower.documentId) {
      return {
        success: false,
        verified: true,
        error: "Creator not found in our system",
      };
    }

    // Step 3: Handle based on intent
    if (intent === "dmca") {
      // Delete all recordings for this follower
      const recordingsResponse = await publicApi.recording.getRecordings({
        filters: {
          follower: { id: { $eq: follower.documentId } },
        },
        "pagination[pageSize]": 100,
      });

      const recordings = recordingsResponse.data?.data || [];
      let deletedCount = 0;

      for (const recording of recordings) {
        if (!recording.documentId) continue;
        try {
          await publicApi.recording.deleteRecordingsId({
            id: String(recording.documentId),
          });
          deletedCount++;
        } catch (e) {
          console.error(
            `Failed to delete recording ${recording.documentId}:`,
            e,
          );
        }
      }

      return {
        success: true,
        verified: true,
        action: "deleted",
        deletedCount,
      };
    } else {
      // Partnership flow: link follower to user
      const localizations = (follower as any).localizations || [];

      const usersResponse =
        await publicApi.usersPermissionsUsersRoles.usersList({
          query: {
            "filters[email][$eqi]": email,
          },
        } as never);

      const existingUser = usersResponse.data?.at(0) as
        | { id: number; documentId: string }
        | undefined;

      if (existingUser) {
        // Link follower to existing user
        await linkUserToFollower(existingUser.documentId, username, platform);
        await updateFollowerOwnership(
          follower.documentId,
          existingUser.id,
          localizations,
        );

        return {
          success: true,
          verified: true,
          action: "linked",
        };
      } else {
        // Create new user with random password
        const { data } =
          await publicApi.usersPermissionsAuth.localRegisterCreate({
            username,
            email,
            password: crypto.randomUUID(),
          });

        const newUser = data.user as { id: number; documentId: string };

        // Link follower to new user
        await linkUserToFollower(newUser.documentId, username, platform);
        await updateFollowerOwnership(
          follower.documentId,
          newUser.id,
          localizations,
        );

        // Set JWT for auto-login
        if (data.jwt) {
          await setToken(data.jwt);
        }

        return {
          success: true,
          verified: true,
          action: "created",
        };
      }
    }
  } catch (error) {
    console.error("Error in verification:", error);
    return {
      success: false,
      verified: false,
      error: "Verification failed",
    };
  }
}

interface SubmitManualVerificationParams {
  profileUrl: string;
  platform: string;
  username: string;
  verificationCode: string;
  additionalInfo: string;
  intent: string;
}

export async function submitManualVerification(
  params: SubmitManualVerificationParams,
): Promise<{ success: boolean; error?: string }> {
  // This could send an email, create a ticket in your system, etc.
  // For now, we'll just call an n8n webhook for manual review

  const n8nManualWebhookUrl = process.env.N8N_MANUAL_VERIFY_WEBHOOK_URL;

  if (!n8nManualWebhookUrl) {
    // If no webhook configured, just return success (manual review will happen elsewhere)
    console.log("Manual verification request:", params);
    return { success: true };
  }

  try {
    const response = await fetch(n8nManualWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to submit manual verification request",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting manual verification:", error);
    return {
      success: false,
      error: "Failed to submit request",
    };
  }
}
