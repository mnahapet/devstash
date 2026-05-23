export default function DashboardPage() {
  return (
    <>
      <aside className="w-60 shrink-0 border-r border-border p-4">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Sidebar
        </h2>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Main
        </h2>
      </main>
    </>
  );
}
