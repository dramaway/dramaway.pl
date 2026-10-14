import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Role → people rows as a definition list.
 *
 * One pattern, two callers: the Portable Text Roles list (`/fundacja` → Zespół)
 * and the credits block on projects and editions. Keep the markup here so both
 * stay identical — the hairlines and the two-column grid live in `.roster*`.
 */
export function Roster({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <dl className={cn("roster", className)}>{children}</dl>;
}

/**
 * One row. Without a role the names take the whole width (`roster-row-plain`);
 * `inline` runs them as a wrapping sequence instead of one name per line —
 * that is the cast list, which would read as a tall table otherwise.
 */
export function RosterRow({
  role,
  note,
  people,
  inline,
}: {
  role?: string | null;
  note?: string | null;
  people: readonly ReactNode[];
  inline?: boolean;
}) {
  if (people.length === 0 && !role) return null;
  return (
    <div className={cn("roster-row", !role && "roster-row-plain")}>
      {role ? (
        <dt className="roster-role">
          {role}
          {note ? <span className="roster-note">{note}</span> : null}
        </dt>
      ) : null}
      <dd className={cn("roster-names", inline && "roster-names-inline")}>
        {people.map((person, index) => (
          <Fragment key={index}>
            {/* A real text node, so the sequence has somewhere to wrap —
                the names themselves must not come apart. */}
            {inline && index > 0 ? (
              <span aria-hidden="true" className="roster-sep">
                {" · "}
              </span>
            ) : null}
            <span className="roster-name">{person}</span>
          </Fragment>
        ))}
      </dd>
    </div>
  );
}
