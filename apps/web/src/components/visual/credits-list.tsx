import { Roster, RosterRow } from "@/components/visual/roster";
import { splitRosterNames } from "@/lib/roster-line";

type CreditRowValue = {
  _key?: string;
  _type?: string;
  role?: string;
  note?: string;
  people?: string;
};

type CreditNamesValue = {
  _key?: string;
  _type?: string;
  label?: string;
  people?: string;
};

type CreditGroupValue = {
  _key?: string;
  title?: string;
  rows?: (CreditRowValue | CreditNamesValue)[];
};

export type CreditsValue = {
  _type?: string;
  heading?: string;
  groups?: CreditGroupValue[];
  note?: string;
};

function isNamesRow(row: CreditRowValue | CreditNamesValue): row is CreditNamesValue {
  return row._type === "creditNames";
}

function renderRow(row: CreditRowValue | CreditNamesValue, index: number) {
  const key = row._key ?? index;
  const people = splitRosterNames(row.people ?? "");
  if (people.length === 0) return null;
  if (isNamesRow(row)) {
    return (
      <RosterRow key={key} role={row.label?.trim() || null} people={people} inline />
    );
  }
  return (
    <RosterRow
      key={key}
      role={row.role?.trim() || null}
      note={row.note?.trim() || null}
      people={people}
    />
  );
}

/**
 * Credits for a project or an edition: groups of role → people rows, plus an
 * optional closing note. Same rows and hairlines as the Roles list on
 * /fundacja (`Roster`), so the two places read as one pattern.
 */
export function CreditsList({ value }: { value?: CreditsValue }) {
  const heading = value?.heading?.trim();
  const note = value?.note?.trim();
  const groups = (value?.groups ?? []).filter(
    (group) => (group.rows ?? []).length > 0,
  );
  if (groups.length === 0 && !note) return null;

  return (
    <section className="credits">
      {heading ? (
        <h3 className="credits-heading font-display text-h3 font-black">
          {heading}
        </h3>
      ) : null}
      {groups.map((group, groupIndex) => (
        <section key={group._key ?? groupIndex} className="credits-group">
          {group.title?.trim() ? (
            <h4 className="credits-group-title">{group.title}</h4>
          ) : null}
          <Roster>
            {(group.rows ?? []).map(renderRow)}
          </Roster>
        </section>
      ))}
      {note ? <p className="credits-note">{note}</p> : null}
    </section>
  );
}
