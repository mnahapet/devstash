import TopBar from '@/components/layout/TopBar';
import { SidebarProvider } from '@/components/layout/sidebar-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className='flex flex-col h-screen'>
        <TopBar />
        <div className='flex flex-1 overflow-hidden'>{children}</div>
      </div>
    </SidebarProvider>
  );
}
