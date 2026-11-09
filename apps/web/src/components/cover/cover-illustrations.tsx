/**
 * One small geometric mark per cover slogan, drawn with the project's
 * circles only (brand palette, sand scallops). Decorative — aria-hidden.
 */

/** "Próba generalna." — the palette row, its last circle still rehearsing. */
export function RehearsalMark() {
  return (
    <span className="cover-mark cover-mark-rehearsal" aria-hidden>
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

/** "Trzeci dzwonek." — two bells have rung, the third rings now. */
export function BellMark() {
  return (
    <span className="cover-mark cover-mark-bells" aria-hidden>
      <span />
      <span />
      <span />
    </span>
  );
}

/**
 * "Kurtyna w górę." — sand scallops (the band motif) as a curtain that rises
 * off the screenshot and stays as a valance at its top edge.
 */
export function CurtainOverlay() {
  return <span className="cover-curtain" data-cover-v="3" aria-hidden />;
}
