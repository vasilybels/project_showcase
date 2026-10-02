// Minimal pub/sub for cross-chart selection state. Replaces chart2's
// module-level `let selectedCategory`, which breaks as soon as more than
// one chart (or two instances of the same chart) exist on a page — exactly
// the situation a combined explorer creates.
export function createSelectionStore(initial = null) {
  let selected = initial;
  const listeners = new Set();

  return {
    get: () => selected,
    set(next) {
      selected = selected === next ? null : next; // toggle, matches old chart2 behavior
      listeners.forEach((fn) => fn(selected));
    },
    clear() {
      selected = null;
      listeners.forEach((fn) => fn(selected));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };
}
