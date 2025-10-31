// app/(main)/layout.js

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

export default function MainLayout({ children }) {
  return (
    <Sidebar>
      <div className="flex h-screen">
        <SidebarBody>
          <SidebarLink />
        </SidebarBody>

        <main className="flex-1 p-6 overflow-y-auto bg-neutral-50">
          {children}
        </main>
      </div>
    </Sidebar>
  );
}
