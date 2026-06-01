export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildEmailHtml(subject: string, message: string, preview: string): string {
  const messageHtml = message
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `<p style="margin:0 0 18px 0;line-height:1.7;color:#5A4438;">${line}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${subject}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F5EFE6;font-family:Georgia,'Times New Roman',serif;">

  <!-- Preview text (hidden) -->
  <span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${preview || subject}
  </span>

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5EFE6;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#FBF7F0;border:1px solid #E2D5C3;border-radius:14px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#2C1810;padding:28px 40px;text-align:center;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:500;color:#8B4513;letter-spacing:-0.01em;line-height:1;">
                Beltà
              </p>
              <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:500;color:rgba(245,239,230,0.45);letter-spacing:0.18em;text-transform:uppercase;">
                Artisan Scarfs · Lebanon
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="height:1px;background-color:#E2D5C3;"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">

              <!-- Eyebrow -->
              <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:#8B4513;line-height:1;">
                A note from Beltà
              </p>

              <!-- Heading = subject -->
              <h1 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:600;color:#2C1810;line-height:1.2;letter-spacing:-0.005em;">
                ${subject}
              </h1>

              <!-- Message -->
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#5A4438;">
                ${messageHtml}
              </div>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">
                <tr>
                  <td style="background-color:#8B4513;border-radius:8px;">
                    <a href="https://belta-website-sigma.vercel.app/shop"
                       style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:500;color:#F5EFE6;text-decoration:none;letter-spacing:0.01em;line-height:1;">
                      Shop the collection
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="height:1px;background-color:#E2D5C3;margin-inline:40px;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#EFE7DA;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8A766A;line-height:1.6;">
                You are receiving this because you subscribed to Beltà updates.<br />
                Drawn in Beirut · Limited pieces only
              </p>
            </td>
          </tr>

        </table>

        <!-- Below card -->
        <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8A766A;text-align:center;">
          © ${new Date().getFullYear()} Beltà · Beirut, Lebanon
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Verify authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify owner role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!roleData || roleData.role !== "owner") {
      return NextResponse.json({ error: "Forbidden — owner role required" }, { status: 403 });
    }

    // Parse and validate body
    const body = await request.json();
    const { subject, message, preview } = body as {
      subject?: string;
      message?: string;
      preview?: string;
    };

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    // Fetch all subscribers
    const { data: subscribers, error: subError } = await supabase
      .from("newsletter_subscribers")
      .select("email, name");

    if (subError) {
      return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers to send to" }, { status: 400 });
    }

    const html = buildEmailHtml(subject.trim(), message.trim(), preview?.trim() ?? "");

    // Send to all subscribers via Resend batch
    const emails = subscribers.map((sub) => ({
      from: "Beltà Scarfs <onboarding@resend.dev>",
      to: sub.email as string,
      subject: subject.trim(),
      html,
    }));

    // Resend allows up to 100 per batch — chunk if needed
    const BATCH = 100;
    let sent = 0;
    for (let i = 0; i < emails.length; i += BATCH) {
      const chunk = emails.slice(i, i + BATCH);
      const { error: sendError } = await resend.batch.send(chunk);
      if (sendError) {
        return NextResponse.json(
          { error: `Resend error: ${sendError.message}` },
          { status: 500 }
        );
      }
      sent += chunk.length;
    }

    return NextResponse.json({ success: true, count: sent });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
