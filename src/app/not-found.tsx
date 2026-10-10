import { ButtonLink, Container } from "@/presentation/components/ui";

export default function NotFound() {
  return (
    <Container className="py-2xl">
      <p className="text-label-md uppercase text-on-surface-variant">404</p>
      <h1 className="mt-sm font-serif text-headline-lg">We couldn&apos;t find that place.</h1>
      <p className="mt-md max-w-[720px] text-body-lg text-on-surface-variant">
        It may have moved, or the link is mistyped.
      </p>
      <ButtonLink href="/" className="mt-xl">
        Back to Wayfare
      </ButtonLink>
    </Container>
  );
}
