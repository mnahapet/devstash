export type SidebarUser = { name: string | null; email: string };

export type SidebarFavCollection = {
  id: string;
  name: string;
  itemCount: number;
  typeDistribution: { color: string; count: number }[];
};

export type SidebarFavItem = {
  id: string;
  title: string;
  itemType: { icon: string; color: string };
};

export type SidebarRecentCollection = {
  id: string;
  name: string;
  itemCount: number;
  typeDistribution: { color: string; count: number }[];
};

export type SidebarRecentItem = {
  id: string;
  title: string;
  itemType: { icon: string; color: string };
};

export type SidebarPinnedCollection = {
  id: string;
  name: string;
  itemCount: number;
  typeDistribution: { color: string; count: number }[];
};

export type SidebarPinnedItem = {
  id: string;
  title: string;
  itemType: { icon: string; color: string };
};
