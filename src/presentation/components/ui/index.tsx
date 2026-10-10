import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Page-width wrapper: 1200px max, DESIGN.md side margins. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cx("mx-auto w-full max-w-[1200px] px-md md:px-xl", className)} {...props} />
  );
}

// ---------- Buttons ----------

type ButtonVariant = "primary" | "ghost";

const buttonBase =
  "inline-flex h-11 items-center justify-center gap-sm rounded-full px-lg text-label-md uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  ghost: "bg-surface text-primary hover:bg-surface-muted",
};

export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  return cx(buttonBase, buttonVariants[variant], className);
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}

/** Ghost-style "See all →" link for section headers. */
export function SeeAllLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-xs text-label-md uppercase text-primary hover:underline underline-offset-4"
    >
      {children}
      <ArrowRight aria-hidden size={16} strokeWidth={1.5} />
    </Link>
  );
}

// ---------- Badge ----------

export function Badge({
  tone,
  children,
  className,
}: {
  tone: "attraction" | "restaurant";
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-sm py-[6px] text-label-md uppercase",
        tone === "attraction" ? "bg-primary text-on-primary" : "bg-secondary text-on-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}

// ---------- Form ----------

export function Input({
  label,
  error,
  id,
  className,
  ...props
}: ComponentProps<"input"> & { label: string; error?: string[] }) {
  const inputId = id ?? props.name;
  const errorId = error?.length ? `${inputId}-error` : undefined;
  return (
    <div className={cx("flex flex-col gap-xs", className)}>
      <label htmlFor={inputId} className="text-label-md uppercase text-on-surface-variant">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        className={cx(
          "h-12 rounded-full border bg-surface px-[14px] text-body-md text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary",
          errorId ? "border-error" : "border-outline",
        )}
        {...props}
      />
      {errorId && (
        <p id={errorId} className="text-body-sm text-error">
          {error!.join(" ")}
        </p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  error,
  id,
  className,
  ...props
}: ComponentProps<"textarea"> & { label: string; error?: string[] }) {
  const fieldId = id ?? props.name;
  const errorId = error?.length ? `${fieldId}-error` : undefined;
  return (
    <div className={cx("flex flex-col gap-xs", className)}>
      <label htmlFor={fieldId} className="text-label-md uppercase text-on-surface-variant">
        {label}
      </label>
      <textarea
        id={fieldId}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        className={cx(
          "rounded-md border bg-surface p-[14px] text-body-md text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary",
          errorId ? "border-error" : "border-outline",
        )}
        {...props}
      />
      {errorId && (
        <p id={errorId} className="text-body-sm text-error">
          {error!.join(" ")}
        </p>
      )}
    </div>
  );
}

// ---------- Feedback & structure ----------

export function Alert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-sm rounded-md bg-error p-md text-body-sm text-on-error">
      <AlertCircle aria-hidden size={20} strokeWidth={1.5} className="mt-[1px] shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cx("h-px border-0 bg-outline", className)} />;
}

/** Page section with generous vertical rhythm; `muted` = full-width off-white band. */
export function Section({
  title,
  action,
  muted = false,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  muted?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx(muted && "bg-surface-muted", "py-xl md:py-2xl", className)}>
      <Container>
        {title && (
          <div className="mb-lg flex items-end justify-between gap-md">
            <h2 className="font-serif text-headline-md">{title}</h2>
            {action}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
