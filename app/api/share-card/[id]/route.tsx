import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSignedUrl } from "@/lib/storage";

export const runtime = "nodejs";

const WIDTH = 1080;
const HEIGHT = 1920;

const TOPIC_COLORS: Record<string, { bg: string; fg: string }> = {
  text: { bg: "rgba(217,70,239,0.18)", fg: "#f0abfc" },
  image: { bg: "rgba(139,92,246,0.18)", fg: "#c4b5fd" },
  video: { bg: "rgba(244,63,94,0.18)", fg: "#fda4af" },
  audio: { bg: "rgba(245,158,11,0.18)", fg: "#fcd34d" },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const message = await prisma.message.findUnique({
    where: { id },
    include: {
      attachments: true,
      receiver: { select: { username: true } },
    },
  });

  if (!message || message.receiverId !== session.user.id) {
    return new Response("Not found", { status: 404 });
  }

  let frameDataUrl: string | null = null;
  try {
    const body = await req.json();
    if (typeof body?.frameDataUrl === "string") frameDataUrl = body.frameDataUrl;
  } catch {
    // no body provided — fine for non-video cards
  }

  const imageAttachment = message.attachments.find((a) => a.type === "image");
  const videoAttachment = message.attachments.find((a) => a.type === "video");
  const hasAudio = message.attachments.some((a) => a.type === "audio");

  let heroImageUrl: string | null = null;
  if (imageAttachment) {
    heroImageUrl = await getSignedUrl(imageAttachment.mediaUrl);
  } else if (videoAttachment && frameDataUrl) {
    heroImageUrl = frameDataUrl;
  }

  const primaryType = imageAttachment
    ? "image"
    : videoAttachment
      ? "video"
      : hasAudio
        ? "audio"
        : "text";
  const topicColor = TOPIC_COLORS[primaryType];
  const username = message.receiver.username;
  const content = message.content?.trim() || null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0510",
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(139,92,246,0.35), transparent 55%), radial-gradient(circle at 85% 85%, rgba(245,158,11,0.28), transparent 50%), radial-gradient(circle at 80% 15%, rgba(217,70,239,0.25), transparent 50%)",
          padding: "64px 56px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Badges */}
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              display: "flex",
              padding: "12px 28px",
              borderRadius: 999,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              backgroundColor: topicColor.bg,
              color: topicColor.fg,
            }}
          >
            {primaryType}
          </div>
          {message.topic && (
            <div
              style={{
                display: "flex",
                padding: "12px 28px",
                borderRadius: 999,
                fontSize: 28,
                fontWeight: 600,
                color: "rgba(255,255,255,0.75)",
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "2px solid rgba(255,255,255,0.12)",
              }}
            >
              {message.topic}
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: heroImageUrl ? "flex-start" : "center",
            alignItems: "center",
            marginTop: 40,
            marginBottom: 40,
          }}
        >
          {heroImageUrl ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: content ? 1120 : 1350,
                borderRadius: 40,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageUrl}
                alt=""
                width={WIDTH - 112}
                height={content ? 1120 : 1350}
                style={{ objectFit: "cover" }}
              />
              {videoAttachment && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    width: 180,
                    height: 180,
                    borderRadius: 999,
                    backgroundColor: "rgba(0,0,0,0.45)",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 80,
                  }}
                >
                  ▶
                </div>
              )}
            </div>
          ) : primaryType === "audio" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 460,
                  height: 460,
                  borderRadius: 999,
                  background:
                    "linear-gradient(135deg, #8b5cf6, #d946ef 50%, #f59e0b)",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 200,
                  marginBottom: 48,
                }}
              >
                🎤
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 46,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Voice message
              </div>
            </div>
          ) : primaryType === "video" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 460,
                  height: 460,
                  borderRadius: 90,
                  background:
                    "linear-gradient(135deg, #8b5cf6, #d946ef 50%, #f59e0b)",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 200,
                  marginBottom: 48,
                }}
              >
                🎬
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 46,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Video message
              </div>
            </div>
          ) : null}

          {content && !heroImageUrl && primaryType === "text" && (
            <div
              style={{
                display: "flex",
                fontSize: 420,
                fontWeight: 800,
                color: "rgba(217,70,239,0.16)",
                marginBottom: -140,
                fontFamily: "serif",
              }}
            >
              &ldquo;
            </div>
          )}

          {content && (
            <div
              style={{
                display: "flex",
                marginTop: heroImageUrl ? 40 : primaryType !== "text" ? 56 : 0,
                fontSize: heroImageUrl ? 52 : primaryType !== "text" ? 44 : 84,
                fontWeight: 700,
                color: "#ffffff",
                textAlign: "center",
                lineHeight: 1.35,
                letterSpacing: -0.5,
              }}
            >
              {content.length > 260 ? `${content.slice(0, 260)}…` : content}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              color: "#e9d5ff",
              letterSpacing: -1,
            }}
          >
            whispr
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "rgba(255,255,255,0.75)",
              textAlign: "center",
            }}
          >
            Send me anonymous whispers 👀
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 8,
              padding: "18px 44px",
              borderRadius: 999,
              fontSize: 34,
              fontWeight: 700,
              color: "#ffffff",
              background: "linear-gradient(90deg, #8b5cf6, #d946ef, #f59e0b)",
            }}
          >
            whispr.app/{username}
          </div>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
