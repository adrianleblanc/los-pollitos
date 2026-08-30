import { ContentEditor } from "@/components/admin/content-editor";

export default function NewContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Nueva Publicación
        </h2>
        <p className="text-xs text-neutral-400">
          Crea tu contenido, asocia multimedia de Cloudflare R2 y prepara la publicación
        </p>
      </div>

      <ContentEditor />
    </div>
  );
}
