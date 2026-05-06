type Primitive = string | number | boolean | null;

export type MenuOptionLike = {
  key: string;
  label: string;
  priceModifier?: number;
  groupKey?: string;
  groupLabel?: string;
  minSelect?: number;
  maxSelect?: number;
  isRequired?: boolean;
  sortOrder?: number;
  badge?: string;
};

type OptionGroup = {
  groupKey: string;
  groupLabel: string;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  options: MenuOptionLike[];
};

export type MenuSelections = Record<string, string | string[]>;

function normalizeGroup(option: MenuOptionLike): OptionGroup {
  const minSelect = typeof option.minSelect === "number" ? option.minSelect : option.isRequired ? 1 : 0;
  const maxSelect = typeof option.maxSelect === "number" ? option.maxSelect : 1;
  const isRequired = typeof option.isRequired === "boolean" ? option.isRequired : minSelect > 0;
  return {
    groupKey: option.groupKey || "extras",
    groupLabel: option.groupLabel || "Extras",
    minSelect,
    maxSelect,
    isRequired,
    options: [],
  };
}

export function groupMenuOptions(options: MenuOptionLike[]): OptionGroup[] {
  const map = new Map<string, OptionGroup>();
  for (const option of options) {
    const key = option.groupKey || "extras";
    if (!map.has(key)) {
      map.set(key, normalizeGroup(option));
    }
    map.get(key)!.options.push(option);
  }

  return Array.from(map.values()).map((group) => ({
    ...group,
    options: [...group.options].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
  }));
}

function toSelectionArray(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

export function defaultSelections(options: MenuOptionLike[]): MenuSelections {
  const groups = groupMenuOptions(options);
  const out: MenuSelections = {};

  for (const group of groups) {
    if (!group.isRequired) continue;
    const popular = group.options.find((opt) => String(opt.badge || "").toLowerCase() === "popular");
    const first = group.options[0];
    const selected = popular?.key || first?.key;
    if (!selected) continue;
    out[group.groupKey] = group.maxSelect > 1 ? [selected] : selected;
  }

  return out;
}

export function calculateSelectionsPrice(
  options: MenuOptionLike[],
  selections: MenuSelections
): { ok: true; extra: number } | { ok: false; error: string } {
  const groups = groupMenuOptions(options);

  for (const group of groups) {
    const selected = toSelectionArray(selections[group.groupKey]);
    if (group.isRequired && selected.length < group.minSelect) {
      return { ok: false, error: `${group.groupLabel} is required` };
    }
    if (selected.length > group.maxSelect) {
      return { ok: false, error: `Too many selections for ${group.groupLabel}` };
    }

    const validKeys = new Set(group.options.map((opt) => opt.key));
    for (const key of selected) {
      if (!validKeys.has(key)) {
        return { ok: false, error: `Invalid option selected for ${group.groupLabel}` };
      }
    }
  }

  const optionLookup = new Map(options.map((opt) => [opt.key, opt]));
  let extra = 0;

  for (const raw of Object.values(selections) as Primitive[] | string[] | string[][]) {
    const selectedKeys = toSelectionArray(raw);
    for (const key of selectedKeys) {
      const opt = optionLookup.get(key);
      if (!opt) continue;
      extra += opt.priceModifier || 0;
    }
  }

  return { ok: true, extra: Math.round(extra * 100) / 100 };
}
