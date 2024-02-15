import * as zlib from 'zlib';

export function compressText(text: string): string {
    const buffer = Buffer.from(text, 'utf-8');
    const compressedBuffer = zlib.deflateSync(buffer);
    return compressedBuffer.toString('base64');
}

export function decompressText(compressedBase64: string): string {
    const compressedBuffer = Buffer.from(compressedBase64, 'base64');
    const decompressedBuffer = zlib.inflateSync(compressedBuffer);
    return decompressedBuffer.toString('utf-8');
}
