import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // In production, require active session
  if (!session?.user && process.env.NODE_ENV === "production") {
    redirect("/login");
  }

  // Fallback user profile for local developer testing before OAuth setup
  const user = session?.user || {
    id: "dev_user_1",
    name: "Adrian Leblanc Morales",
    email: "adrian@lospollitos.com",
    role: "OWNER (Modo Pruebas)",
    image: null,
  };

  let workspaceName = "Los Pollitos";

  try {
    if (session?.user?.currentWorkspaceId) {
      const workspace = await prisma.workspace.findUnique({
        where: { id: session.user.currentWorkspaceId },
      });
      if (workspace) workspaceName = workspace.name;
    }
  } catch {
    // Graceful fallback for local dev
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex selection:bg-amber-500 selection:text-neutral-950">
      {/* Persistent Left Sidebar */}
      <Sidebar user={user} workspaceName={workspaceName} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header workspaceName={workspaceName} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
