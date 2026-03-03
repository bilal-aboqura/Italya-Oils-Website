/**
 * ItalyaOils Arabic logo — inline SVG component.
 * Renders the "الإيطالية / لزيوت السيارات" badge logo from the original PDF.
 * Pass `variant="light"` for a white-text version (dark backgrounds like admin sidebar).
 */
export default function Logo({
  variant = "dark",
  height = 48,
}: {
  variant?: "dark" | "light";
  height?: number;
}) {
  const textColor = variant === "light" ? "#ffffff" : "#1a1a1a";
  const borderColor = variant === "light" ? "#ffffff" : "#1a1a1a";
  const bgColor = "transparent";

  const aspectRatio = 2.8;
  const width = height * aspectRatio;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Outer border */}
      <rect x="2" y="2" width="276" height="96" rx="4" ry="4"
        stroke={borderColor} strokeWidth="3.5" fill={bgColor} />
      {/* Inner border */}
      <rect x="8" y="8" width="264" height="80" rx="2" ry="2"
        stroke={borderColor} strokeWidth="1.5" fill={bgColor} />

      {/* Main Arabic text: الإيطالية */}
      <text
        x="140"
        y="52"
        textAnchor="middle"
        fontFamily="'Noto Naskh Arabic', 'Traditional Arabic', 'Arabic Typesetting', serif"
        fontSize="36"
        fontWeight="700"
        fill={textColor}
        direction="rtl"
      >
        الإيطالية
      </text>

      {/* Sub-text: لزيوت السيارات */}
      <text
        x="140"
        y="76"
        textAnchor="middle"
        fontFamily="'Noto Naskh Arabic', 'Traditional Arabic', 'Arabic Typesetting', serif"
        fontSize="16"
        fontWeight="400"
        fill={textColor}
        letterSpacing="1"
        direction="rtl"
      >
        لزيوت السيارات
      </text>
    </svg>
  );
}
