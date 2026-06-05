export type SidebarUser = { name: string | null; email: string; image?: string | null };

export type SidebarCollection = {
  id: string;
  name: string;
  itemCount: number;
  typeDistribution: { color: string; count: number }[];
};

export type SidebarItem = {
  id: string;
  title: string;
  itemType: { icon: string; color: string };
};
