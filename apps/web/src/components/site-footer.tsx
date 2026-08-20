type Props = {
  title: string;
  note: string | null;
};

export function SiteFooter({ title, note }: Props) {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {title}
        </p>
        {note ? <p className="mt-2 max-w-2xl">{note}</p> : null}
      </div>
    </footer>
  );
}
