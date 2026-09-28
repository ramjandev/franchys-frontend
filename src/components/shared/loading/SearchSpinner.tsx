interface SearchSpinnerProps {
  size?: number;
  className?: string;
}

const SearchSpinner: React.FC<SearchSpinnerProps> = ({
  size = 16,
  className = "",
}) => (
  <div
    role="status"
    aria-label="Searching"
    className={`inline-block rounded-full border-2 border-[#CAD5E2] border-t-[#1447E6] animate-spin pointer-events-none ${className}`}
    style={{ width: size, height: size }}
  />
);

export default SearchSpinner;
