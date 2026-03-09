import Image from "next/image";

/**
 * ItalyaOils Logo
 */
export default function Logo({
  variant = "dark",
  height = 48,
}: {
  variant?: "dark" | "light";
  height?: number;
}) {
  const width = height * 2.8;

  return (
    <div style={{ position: "relative", width, height, display: "inline-block" }}>
      <Image
        src="/images/Logo_-_al_eltalyia_page-0001-removebg-preview.png"
        alt="Italya Oils"
        fill
        className={`object-contain ${variant === "light" ? "brightness-0 invert opacity-90" : ""}`}
        priority
      />
    </div>
  );
}

