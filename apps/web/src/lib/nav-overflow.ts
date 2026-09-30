/**
 * How many leading items stay in a single nav row when the rest go behind
 * an overflow control (priority+).
 */
export function visibleNavCount({
  containerWidth,
  itemWidths,
  overflowWidth,
  gap,
}: {
  containerWidth: number;
  itemWidths: readonly number[];
  overflowWidth: number;
  gap: number;
}): number {
  const count = itemWidths.length;
  if (count === 0) return 0;

  function widthOf(visible: number, withOverflow: boolean): number {
    let width = 0;
    for (let index = 0; index < visible; index += 1) {
      if (index > 0) width += gap;
      width += itemWidths[index] ?? 0;
    }
    if (withOverflow) {
      if (visible > 0) width += gap;
      width += overflowWidth;
    }
    return width;
  }

  if (widthOf(count, false) <= containerWidth) return count;

  for (let visible = count - 1; visible >= 0; visible -= 1) {
    if (widthOf(visible, true) <= containerWidth) return visible;
  }

  return 0;
}
