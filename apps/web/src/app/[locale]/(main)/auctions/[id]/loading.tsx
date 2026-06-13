import { Container, Skeleton } from "@mazad/ui";

export default function AuctionDetailLoading() {
  return (
    <Container className="space-y-8 py-2 md:py-4">
      <Skeleton className="h-5 w-36" />
      <header className="space-y-4 border-b border-separator pb-6">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full max-w-2xl" />
      </header>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-6 lg:col-span-7">
          <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
        <aside className="lg:col-span-5">
          <Skeleton className="h-[520px] w-full rounded-2xl" />
        </aside>
      </div>
    </Container>
  );
}
