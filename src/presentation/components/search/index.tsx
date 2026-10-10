import Form from "next/form";
import type { ReactNode } from "react";
import { Search } from "lucide-react";
import type { Area, AreaId, PlaceType } from "@/domain/entities";
import { Button, cx } from "../ui";

const fieldClass =
  "h-12 w-full rounded-full border border-outline bg-surface px-[14px] text-body-md text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary";

function SearchInput({ defaultValue, label }: { defaultValue?: string; label: string }) {
  return (
    <div className="relative flex-1">
      <label htmlFor="search-q" className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden
        size={20}
        strokeWidth={1.5}
        className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-on-surface-variant"
      />
      <input
        id="search-q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Pad thai, temples, rooftop…"
        maxLength={100}
        className={cx(fieldClass, "pl-[44px]")}
      />
    </div>
  );
}

/** Hero search: one field and a button. GET /search?q=… — works without JS. */
export function SearchBar({ className }: { className?: string }) {
  return (
    <Form action="/search" role="search" className={cx("flex max-w-[640px] flex-col gap-sm sm:flex-row", className)}>
      <SearchInput label="Search places" />
      <Button type="submit">Search</Button>
    </Form>
  );
}

export interface SearchFilterValues {
  q?: string;
  type?: PlaceType;
  areaId?: AreaId;
}

/** Text + type + area, all kept in the URL so results can be shared. */
export function SearchFilters({ values, areas }: { values: SearchFilterValues; areas: Area[] }) {
  return (
    <Form
      action="/search"
      role="search"
      className="grid grid-cols-1 gap-sm md:grid-cols-[minmax(0,1fr)_180px_200px_auto]"
    >
      <SearchInput label="Search places" defaultValue={values.q} />
      <Select name="type" label="Type" defaultValue={values.type}>
        <option value="">All types</option>
        <option value="restaurant">Restaurants</option>
        <option value="attraction">Attractions</option>
      </Select>
      <Select name="area" label="Area" defaultValue={values.areaId}>
        <option value="">All areas</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </Select>
      <Button type="submit" className="h-12">
        Search
      </Button>
    </Form>
  );
}

function Select({
  name,
  label,
  defaultValue,
  children,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`search-${name}`} className="sr-only">
        {label}
      </label>
      <select
        id={`search-${name}`}
        name={name}
        defaultValue={defaultValue ?? ""}
        className={cx(fieldClass, "appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-[40px]")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235F5F5F' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
      >
        {children}
      </select>
    </div>
  );
}
