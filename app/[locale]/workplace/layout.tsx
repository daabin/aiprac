import PlaceLayout from "@/components/PlaceLayout";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Record<string, any>;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden p-2 bg-sky-100">
      <PlaceLayout params={params}>{children}</PlaceLayout>
    </div>
  );
}