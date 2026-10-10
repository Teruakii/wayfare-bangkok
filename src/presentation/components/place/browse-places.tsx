import Link from "next/link";
import { Suspense } from "react";
import { LayoutGrid, Map as MapIcon } from "lucide-react";
import { container } from "@/di/container";
import { isAreaId, type Area, type AreaId, type PlaceType } from "@/domain/entities";
import { MapLegend, PlaceMap } from "../map";
import { toMapPlaces } from "../map/map-place";
import { Container, Section, cx } from "../ui";
import { PlaceGrid, toAreaNames } from ".";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type View = "grid" | "map";

/** Builds list-page URLs, keeping area and view together. */
function browseHref(basePath: string, areaId: AreaId | undefined, view: View): string {
  const params = new URLSearchParams();
  if (areaId) params.set("area", areaId);
  if (view === "map") params.set("view", "map");
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** Shared layout for /restaurants and /attractions: intro + area filter + grid. */
export function BrowsePlaces({
  type,
  basePath,
  title,
  intro,
  searchParams,
}: {
  type: PlaceType;
  basePath: string;
  title: string;
  intro: string;
  searchParams: SearchParams;
}) {
  return (
    <>
      <Container className="pt-xl md:pt-2xl">
        <p className="text-label-md uppercase text-on-surface-variant">Bangkok</p>
        <h1 className="mt-sm font-serif text-headline-lg md:text-display">{title}</h1>
        <p className="mt-md max-w-[720px] text-body-lg text-on-surface-variant">{intro}</p>
      </Container>
      <Section className="pt-xl md:pt-xl">
        {/* searchParams is request data, so the filtered list streams in. */}
        <Suspense
          fallback={<p className="text-body-sm text-on-surface-variant">Loading places…</p>}
        >
          <FilteredPlaces type={type} basePath={basePath} searchParams={searchParams} />
        </Suspense>
      </Section>
    </>
  );
}

async function FilteredPlaces({
  type,
  basePath,
  searchParams,
}: {
  type: PlaceType;
  basePath: string;
  searchParams: SearchParams;
}) {
  const { area, view: rawView } = await searchParams;
  // Unknown ?area= / ?view= values fall back to defaults instead of erroring.
  const areaId = isAreaId(area) ? area : undefined;
  const view: View = rawView === "map" ? "map" : "grid";
  const [places, areas] = await Promise.all([
    container.places.list({ type, areaId }),
    container.places.listAreas(),
  ]);
  const areaNames = toAreaNames(areas);

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-md lg:flex-row lg:items-start lg:justify-between">
        <AreaFilter areas={areas} active={areaId} basePath={basePath} view={view} />
        <ViewToggle basePath={basePath} areaId={areaId} view={view} />
      </div>
      {view === "map" ? (
        <div className="flex flex-col gap-md">
          <PlaceMap
            places={toMapPlaces(places, areaNames)}
            label={`Map of ${places.length} places`}
            className="h-[60vh] min-h-[400px] rounded-lg"
          />
          <MapLegend />
        </div>
      ) : (
        <PlaceGrid
          places={places}
          areaNames={areaNames}
          emptyMessage="Nothing here yet — try another area."
        />
      )}
    </div>
  );
}

function ViewToggle({
  basePath,
  areaId,
  view,
}: {
  basePath: string;
  areaId?: AreaId;
  view: View;
}) {
  const options = [
    { value: "grid" as const, label: "Grid", Icon: LayoutGrid },
    { value: "map" as const, label: "Map", Icon: MapIcon },
  ];
  return (
    <nav aria-label="View" className="flex shrink-0 rounded-full border border-outline p-[3px]">
      {options.map(({ value, label, Icon }) => {
        const isActive = value === view;
        return (
          <Link
            key={value}
            href={browseHref(basePath, areaId, value)}
            aria-current={isActive ? "page" : undefined}
            scroll={false}
            className={cx(
              "inline-flex h-8 items-center gap-xs rounded-full px-md text-label-md uppercase transition-colors",
              isActive ? "bg-primary text-on-primary" : "text-on-surface hover:text-primary",
            )}
          >
            <Icon aria-hidden size={16} strokeWidth={1.5} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AreaFilter({
  areas,
  active,
  basePath,
  view = "grid",
}: {
  areas: Area[];
  active?: AreaId;
  basePath: string;
  view?: View;
}) {
  const options = [{ id: undefined, name: "All areas" }, ...areas];
  return (
    <nav aria-label="Filter by area">
      <ul className="flex flex-wrap gap-sm">
        {options.map((option) => {
          const isActive = option.id === active;
          return (
            <li key={option.id ?? "all"}>
              <Link
                href={browseHref(basePath, option.id, view)}
                aria-current={isActive ? "page" : undefined}
                scroll={false}
                className={cx(
                  "inline-flex h-9 items-center rounded-full border px-md text-label-md uppercase transition-colors",
                  isActive
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline text-on-surface hover:border-primary hover:text-primary",
                )}
              >
                {option.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
