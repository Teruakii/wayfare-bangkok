import type { Metadata } from "next";
import { Suspense } from "react";
import { container } from "@/di/container";
import { ValidationError } from "@/domain/errors";
import { isAreaId, isPlaceType, type Place } from "@/domain/entities";
import { PlaceGrid, toAreaNames } from "@/presentation/components/place";
import { SearchFilters } from "@/presentation/components/search";
import { Alert, Container, Section } from "@/presentation/components/ui";

export const metadata: Metadata = { title: "Search — Wayfare Bangkok" };

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <>
      <Container className="pt-xl md:pt-2xl">
        <h1 className="font-serif text-headline-lg md:text-display">Search</h1>
      </Container>
      <Section className="pt-lg md:pt-lg">
        <Suspense fallback={<p className="text-body-sm text-on-surface-variant">Loading…</p>}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </Section>
    </>
  );
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

async function SearchResults({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const params = await searchParams;
  const raw = { text: first(params.q), type: first(params.type), areaId: first(params.area) };
  const areas = await container.places.listAreas();

  let places: Place[] = [];
  let errors: string[] = [];
  try {
    places = await container.places.search(raw);
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error;
    errors = Object.values(error.fieldErrors).flat();
  }

  const hasQuery = Boolean(raw.text?.trim() || raw.type || raw.areaId);
  return (
    <div className="flex flex-col gap-xl">
      <SearchFilters
        // Re-mount when the URL changes so the fields show the current query.
        key={JSON.stringify(raw)}
        areas={areas}
        values={{
          q: raw.text,
          type: isPlaceType(raw.type) ? raw.type : undefined,
          areaId: isAreaId(raw.areaId) ? raw.areaId : undefined,
        }}
      />
      {errors.length > 0 ? (
        <Alert>{errors.join(" ")}</Alert>
      ) : (
        <>
          <p className="text-body-sm text-on-surface-variant" aria-live="polite">
            {hasQuery
              ? `${places.length} ${places.length === 1 ? "place" : "places"} found`
              : `All ${places.length} places`}
          </p>
          <PlaceGrid
            places={places}
            areaNames={toAreaNames(areas)}
            emptyMessage="No places match. Try a shorter search or fewer filters."
          />
        </>
      )}
    </div>
  );
}
