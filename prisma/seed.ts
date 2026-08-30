import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL || "";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Neon database with URL:", connectionString.replace(/:[^:@]+@/, ":***@"));

  // 1. Create Default Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: "los-pollitos" },
    update: {},
    create: {
      id: "dev-workspace-los-pollitos",
      name: "Los Pollitos",
      slug: "los-pollitos",
      description: "Workspace principal y canal oficial de Los Pollitos Tejen",
    },
  });

  console.log("Workspace created/verified:", workspace.name);

  // 2. Create Initial Categories
  const categories = [
    { name: "Prendas de Mascotas", slug: "prendas-mascotas", color: "#F59E0B", description: "Tutoriales de ropa y accesorios tejidos para perros y gatos" },
    { name: "Flores & Plantas", slug: "flores-plantas", color: "#EC4899", description: "Ramos eternos, macetas y flores a crochet" },
    { name: "Gorros & Bufandas", slug: "gorros-bufandas", color: "#3B82F6", description: "Prendas de abrigo para todas las edades" },
    { name: "Amigurumis", slug: "amigurumis", color: "#10B981", description: "Muñecos y figuras tejidas paso a paso" },
    { name: "Prendas de Vestir", slug: "prendas-vestir", color: "#8B5CF6", description: "Chalecos, tops y blusas tejidas" },
    { name: "Consejos & Puntos", slug: "consejos-puntos", color: "#6366F1", description: "Guías de puntos básicos y avanzados para principiantes" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: {
        workspaceId_slug: {
          workspaceId: workspace.id,
          slug: cat.slug,
        },
      },
      update: {},
      create: {
        workspaceId: workspace.id,
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
        description: cat.description,
      },
    });
  }

  console.log(`Created ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
