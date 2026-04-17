import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import OpenAI from "openai";
import { toFile } from "openai/uploads";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    let file: File | Blob = audioFile instanceof File 
      ? audioFile 
      : (audioFile as unknown as Blob);

    const rawType = file instanceof File 
      ? (file.type || "audio/webm")
      : (file.type || "audio/webm");
    const normalizedType = rawType.split(";")[0]?.trim().toLowerCase() || "audio/webm";

    const supportedExtByType: Record<string, string> = {
      "audio/webm": "webm",
      "audio/wav": "wav",
      "audio/x-wav": "wav",
      "audio/mpeg": "mp3",
      "audio/mp3": "mp3",
      "audio/mp4": "mp4",
      "audio/x-m4a": "m4a",
      "audio/m4a": "m4a",
      "audio/ogg": "ogg",
      "audio/oga": "oga",
      "audio/flac": "flac",
    };

    let filenameExt: string | null = null;
    if (file instanceof File && file.name && file.name.includes(".") && !file.name.endsWith(".")) {
      filenameExt = file.name.split(".").pop()?.toLowerCase() || null;
    }

    const supportedExts = Object.values(supportedExtByType);
    let fallbackExt: string;
    
    if (filenameExt && supportedExts.includes(filenameExt)) {
      fallbackExt = filenameExt;
      console.log(`Using filename extension: ${filenameExt} (MIME type was: ${normalizedType})`);
    } else if (supportedExtByType[normalizedType]) {
      fallbackExt = supportedExtByType[normalizedType];
    } else {
      return NextResponse.json(
        { 
          error: `Unsupported audio format: ${normalizedType}. Supported formats: ${Object.keys(supportedExtByType).join(", ")}` 
        },
        { status: 400 }
      );
    }
    
    let resolvedName: string;
    if (file instanceof File && file.name && file.name.includes(".") && !file.name.endsWith(".")) {
      const existingExt = file.name.split(".").pop()?.toLowerCase();
      if (existingExt && supportedExts.includes(existingExt)) {
        resolvedName = file.name;
      } else {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
        resolvedName = `${nameWithoutExt}.${fallbackExt}`;
      }
    } else {
      resolvedName = `audio.${fallbackExt}`;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const firstBytes = buffer.slice(0, Math.min(16, buffer.length));
    console.log('First bytes of file (hex):', firstBytes.toString('hex'));
    console.log('First bytes of file (ascii):', firstBytes.toString('ascii').replace(/[^\x20-\x7E]/g, '.'));

    const detectFormatFromBytes = (buf: Buffer): string | null => {
      if (buf.length >= 4 && buf[0] === 0x1A && buf[1] === 0x45 && buf[2] === 0xDF && buf[3] === 0xA3) {
        return 'webm';
      }
      if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WAVE') {
        return 'wav';
      }
      if (buf.length >= 3 && (
        (buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) ||
        (buf[0] === 0xFF && (buf[1] === 0xFB || buf[1] === 0xF3))
      )) {
        return 'mp3';
      }
      if (buf.length >= 4 && buf.toString('ascii', 0, 4) === 'OggS') {
        return 'ogg';
      }
      if (buf.length >= 4 && buf.toString('ascii', 0, 4) === 'fLaC') {
        return 'flac';
      }
      if (buf.length >= 12 && buf.toString('ascii', 4, 8) === 'ftyp') {
        const brand = buf.toString('ascii', 8, 12);
        if (brand === 'M4A ' || brand === 'mp41' || brand === 'isom') {
          return 'm4a';
        }
        return 'mp4';
      }
      return null;
    };

    const detectedFormat = detectFormatFromBytes(buffer);
    
    let actualExt = fallbackExt;
    if (filenameExt === 'wav') {
      actualExt = 'wav';
      if (detectedFormat && detectedFormat !== 'wav') {
        console.log(`Filename indicates WAV, but magic bytes suggest ${detectedFormat}. Using WAV from filename.`);
      } else if (!detectedFormat) {
        console.log(`Filename indicates WAV, but magic bytes not detected. Using WAV from filename.`);
      }
    } else if (detectedFormat) {
      actualExt = detectedFormat;
      if (detectedFormat !== fallbackExt) {
        console.warn(`Format mismatch: MIME type suggests ${fallbackExt}, but file content indicates ${detectedFormat}`);
      }
    } else if (!detectedFormat && buffer.length > 0) {
      console.warn(`Could not detect file format from magic bytes. Using extension: ${fallbackExt}`);
    }

    let finalFilename = resolvedName.endsWith(`.${fallbackExt}`) 
      ? resolvedName 
      : resolvedName.includes(".") 
        ? resolvedName.substring(0, resolvedName.lastIndexOf(".")) + `.${fallbackExt}`
        : `audio.${fallbackExt}`;

    if (detectedFormat && detectedFormat !== fallbackExt) {
      const baseName = finalFilename.includes('.') 
        ? finalFilename.substring(0, finalFilename.lastIndexOf('.'))
        : 'audio';
      finalFilename = `${baseName}.${actualExt}`;
      console.log(`Format mismatch detected: MIME type suggests ${fallbackExt}, but file content indicates ${detectedFormat}. Using ${detectedFormat}.`);
    }

    const supportedExtensions = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm'];
    const fileExt = finalFilename.split('.').pop()?.toLowerCase();
    if (!fileExt || !supportedExtensions.includes(fileExt)) {
      const baseName = finalFilename.includes('.') 
        ? finalFilename.substring(0, finalFilename.lastIndexOf('.'))
        : 'audio';
      finalFilename = `${baseName}.${actualExt}`;
    }

    console.log('Transcription request:', {
      originalName: file instanceof File ? file.name : 'blob',
      originalType: rawType,
      normalizedType,
      fallbackExt,
      finalFilename,
      detectedFormat,
      actualExt,
      bufferSize: buffer.length
    });

    let upload = await toFile(buffer, finalFilename);
    
    console.log('Upload file details:', {
      name: upload.name,
      type: (upload as any).type || 'unknown',
      size: (upload as any).size || buffer.length
    });
    
    const uploadExt = upload.name.split('.').pop()?.toLowerCase();
    if (!uploadExt || !supportedExtensions.includes(uploadExt)) {
      console.error('CRITICAL: Upload filename does not have a valid extension!', {
        uploadName: upload.name,
        uploadExt,
        expectedExt: actualExt
      });
      return NextResponse.json(
        { error: `Invalid file extension: ${uploadExt}. Expected one of: ${supportedExtensions.join(', ')}` },
        { status: 400 }
      );
    }

    let transcriptionData;
    try {
      transcriptionData = await openai.audio.transcriptions.create({
        file: upload,
        model: "whisper-1",
        language: "en",
        response_format: "verbose_json",
      });
    } catch (error: any) {
      if (uploadExt === 'webm' && !detectedFormat && error?.status === 400) {
        console.warn('WebM format rejected, trying with OGG extension as fallback...');
        const oggFilename = finalFilename.replace(/\.webm$/i, '.ogg');
        upload = await toFile(buffer, oggFilename);
        
        try {
          transcriptionData = await openai.audio.transcriptions.create({
            file: upload,
            model: "whisper-1",
            language: "en",
            response_format: "verbose_json",
          });
          console.log('Successfully transcribed with OGG extension');
        } catch (oggError: any) {
          console.error('Both WebM and OGG formats failed. File might be incomplete or corrupted.');
          console.error('Original error:', error.message);
          console.error('OGG fallback error:', oggError.message);
          
          const helpfulError = new Error(
            'Audio file format not supported. The file might be incomplete or corrupted. ' +
            'Please ensure the audio recording is complete before sending.'
          );
          (helpfulError as any).status = 400;
          throw helpfulError;
        }
      } else {
        throw error;
      }
    }

    return NextResponse.json({
      text: transcriptionData.text,
      segments: (transcriptionData as any).segments,
      duration: (transcriptionData as any).duration,
    });
  } catch (error) {
    console.error("Error transcribing audio:", error);

    const maybeStatus = (error as any)?.status;
    const maybeMessage =
      (error as any)?.error?.message ||
      (error as any)?.message ||
      "Internal server error";

    if (maybeStatus && typeof maybeStatus === "number") {
      return NextResponse.json({ error: maybeMessage }, { status: maybeStatus });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

