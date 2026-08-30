import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ContentEditor } from "@/components/admin/content-editor";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const workspaceId = session?.user?.currentWorkspaceId || "dev-workspace-los-pollitos";
  const { id } = await params;

  let serializedContent: any = null;

  try {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        media: {
          include: { media: true },
          orderBy: { sortOrder: "asc" },
        },
        categories: { include: { category: true } },
      },
    });

    if (content) {
      serializedContent = {
        ...content,
        media: content.media.map((cm) => ({
          ...cm,
          media: {
            ...cm.media,
            fileSize: cm.media.fileSize.toString(),
          },
        })),
      };
    }
  } catch (dbErr) {
    console.warn("DB offline in edit content page:", dbErr);
  }

  // Fallback mock content if DB is offline or mock ID was created
  if (!serializedContent) {
    serializedContent = {
      id,
      title: "Prueba",
      description: "esto es una prueba",
      type: "STANDARD_VIDEO",
      status: "READY",
      tags: ["crochet", "tutorial"],
      media: [],
      categories: [],
      customMetadata: {
        youtube: {
          targetChannel: "TESTING_ADRIAN",
          privacyStatus: "private",
        },
      },
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Editar Publicación
        </h2>
        <p className="text-xs text-neutral-400">
          Modifica los detalles, multimedia asignada o parámetros de publicación
        </p>
      </div>

      <ContentEditor initialData={serializedContent} isEditing={true} />
    </div>
  );
}
