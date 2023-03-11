import { Duplex, Readable, Writable } from "stream"

declare class AsyncBinaryStream {
    constructor(stream: Duplex | Readable | Writable)

    readBuffer(size: number): Promise<Buffer>

    readUInt8(): Promise<number>
    readInt8(): Promise<number>

    readUInt16BE(): Promise<number>
    readUInt16LE(): Promise<number>

    readInt16BE(): Promise<number>
    readInt16LE(): Promise<number>

    readUInt32BE(): Promise<number>
    readUInt32LE(): Promise<number>

    readInt32BE(): Promise<number>
    readInt32LE(): Promise<number>

    readUInt64BE(): Promise<bigint>
    readUInt64LE(): Promise<bigint>

    readInt64BE(): Promise<bigint>
    readInt64LE(): Promise<bigint>

    readFloatBE(): Promise<number>
    readFloatLE(): Promise<number>

    readDoubleBE(): Promise<number>
    readDoubleLE(): Promise<number>

    readString(length: number, encoding: string = "utf-8"): Promise<string>

    readNullTerminatingString(encoding: string = "utf-8"): Promise<string>

    readString8(encoding: string = "utf-8"): Promise<string>
    readString16BE(encoding: string = "utf-8"): Promise<string>
    readString16LE(encoding: string = "utf-8"): Promise<string>
    readString32BE(encoding: string = "utf-8"): Promise<string>
    readString32LE(encoding: string = "utf-8"): Promise<string>

    flush(): Promise<void>

    writeBuffer(buffer: Buffer): void

    writeUInt8(n: number): void
    writeInt8(n: number): void

    writeUInt16BE(n: number): void
    writeUInt16LE(n: number): void
    writeInt16BE(n: number): void
    writeInt16LE(n: number): void

    writeUInt32BE(n: number): void
    writeUInt32LE(n: number): void
    writeInt32BE(n: number): void
    writeInt32LE(n: number): void

    writeUInt64BE(n: bigint): void
    writeUInt64LE(n: bigint): void
    writeInt64BE(n: bigint): void
    writeInt64LE(n: bigint): void

    writeFloatBE(n: number): void
    writeFloatLE(n: number): void

    writeDoubleBE(n: number): void
    writeDoubleLE(n: number): void

    writeString(string: string): void

    writeNullTerminatingString(string: string): void

    writeString8(string: string): void
    writeString16BE(string: string): void
    writeString16LE(string: string): void
    writeString32BE(string: string): void
    writeString32LE(string: string): void
}

export = AsyncBinaryStream
