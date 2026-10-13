import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
        }}
      >
        <span
          style={{
            fontSize: 108,
            fontWeight: 700,
            color: "#fff",
            fontFamily: "sans-serif",
            lineHeight: 1,
            transform: "translateY(-3px)",
          }}
        >
          w
        </span>
      </div>
    ),
    { ...size },
  );
}
