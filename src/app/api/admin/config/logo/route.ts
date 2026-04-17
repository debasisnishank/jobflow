import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { updateAppConfig, clearConfigCache } from "@/lib/admin/config.service";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);

    const publicDir = join(process.cwd(), "public");
    const imagesDir = join(publicDir, "images");
    
    await mkdir(imagesDir, { recursive: true });

    const fileName = `logo-${Date.now()}.${file.name.split(".").pop()}`;
    const filePath = join(imagesDir, fileName);
    
    await writeFile(filePath, uint8Array);

    const logoPath = `/images/${fileName}`;
    
    await updateAppConfig({ logoPath });
    clearConfigCache();

    return NextResponse.json({ logoPath });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to upload logo" },
      { status: 500 }
    );
  }
}
