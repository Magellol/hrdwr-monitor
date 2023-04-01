export const ThermometerIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    width="40"
    height="80"
    viewBox="0 0 40 80"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M32 44V12C32 5.36 26.64 0 20 0C13.36 0 8 5.36 8 12V44C3.16 47.64 0 53.48 0 60C0 71.04 8.96 80 20 80C31.04 80 40 71.04 40 60C40 53.48 36.84 47.64 32 44ZM16 12C16 9.8 17.8 8 20 8C22.2 8 24 9.8 24 12H20V16H24V24H20V28H24V36H16V12Z" />
  </svg>
);
