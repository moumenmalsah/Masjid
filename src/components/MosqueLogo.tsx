interface MosqueLogoProps {
  className?: string;
  size?: number;
}

export default function MosqueLogo({ className = '', size = 32 }: MosqueLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left minaret */}
      <rect x="5" y="14" width="3" height="14" rx="0.5" fill="currentColor" />
      <path d="M4.5 14L6.5 8L8.5 14Z" fill="currentColor" />
      {/* Right minaret */}
      <rect x="24" y="14" width="3" height="14" rx="0.5" fill="currentColor" />
      <path d="M23.5 14L25.5 8L27.5 14Z" fill="currentColor" />
      {/* Dome base */}
      <rect x="8" y="20" width="16" height="8" rx="1" fill="currentColor" />
      {/* Dome */}
      <path
        d="M8 20C8 14.477 11.582 10 16 10C20.418 10 24 14.477 24 20"
        fill="currentColor"
      />
      {/* Crescent */}
      <path
        d="M16 7C16 7 14.5 8.5 14.5 10C14.5 11.5 16 13 16 13C15 13 13.5 11.5 13.5 10C13.5 8.5 15 7 16 7Z"
        fill="currentColor"
      />
      {/* Arched entrance */}
      <path
        d="M14 28V24C14 22.895 14.895 22 16 22C17.105 22 18 22.895 18 24V28"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
