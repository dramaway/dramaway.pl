type HeroLeadProps = {
  children: string;
  className?: string;
};

export function HeroLead({ children, className }: HeroLeadProps) {
  const lines = children.split(/\r?\n/);

  return (
    <p className={className}>
      {lines.map((line, index) => (
        <span key={index}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </p>
  );
}
