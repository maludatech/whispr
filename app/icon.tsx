import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 14,
        }}
      >
        <span
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: "#fff",
            fontFamily: "sans-serif",
            lineHeight: 1,
            transform: "translateY(-1px)",
          }}
        >
          w
        </span>
      </div>
    ),
    { ...size },
  );
}
