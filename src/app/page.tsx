import Link from "next/link";
import { container } from "@/di/container";
import { PlaceGrid, toAreaNames } from "@/presentation/components/place";
import { SearchBar } from "@/presentation/components/search";
import { Container, SeeAllLink, Section } from "@/presentation/components/ui";

export default async function HomePage() {
  const [restaurants, attractions, areas] = await Promise.all([
    container.places.list({ type: "restaurant", featured: true }),
    container.places.list({ type: "attraction", featured: true }),
    container.places.listAreas(),
  ]);
  const areaNames = toAreaNames(areas);

  return (
    <>
      <Container className="py-xl md:py-2xl">
        <p className="text-label-md uppercase text-on-surface-variant">Bangkok, Thailand</p>
        <h1 className="mt-sm font-serif text-headline-lg sm:text-display">Bangkok, slowly.</h1>
        <p className="mt-lg max-w-[720px] text-body-lg text-on-surface-variant">
          A short, opinionated list of places to eat and things to see — chosen for flavour,
          character and a reason to linger.
        </p>
        <SearchBar className="mt-xl" />
      </Container>

      <Section
        title="Where to eat"
        action={<SeeAllLink href="/restaurants">All restaurants</SeeAllLink>}
      >
        <PlaceGrid places={restaurants.slice(0, 3)} areaNames={areaNames} />
      </Section>

      <Section
        title="Things to see"
        action={<SeeAllLink href="/attractions">All attractions</SeeAllLink>}
      >
        <PlaceGrid places={attractions.slice(0, 3)} areaNames={areaNames} />
      </Section>

      <Section title="Explore by area" muted>
        <ul className="grid grid-cols-1 gap-x-lg gap-y-xl sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <li key={area.id} className="flex flex-col gap-xs">
              <h3 className="font-serif text-headline-md">{area.name}</h3>
              <p className="text-body-md text-on-surface-variant">{area.description}</p>
              <p className="mt-xs flex gap-md text-label-md uppercase">
                <Link className="text-primary hover:underline underline-offset-4" href={`/restaurants?area=${area.id}`}>
                  Eat
                </Link>
                <Link className="text-primary hover:underline underline-offset-4" href={`/attractions?area=${area.id}`}>
                  See
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
