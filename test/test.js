const DuplexStream = require("stream").Duplex
const assert = require("assert")
const AsyncStream = require("./../index")

let stream = new DuplexStream({
    read: () => {},
    write: (chunk, encoding, callback) => {
        stream.push(chunk)
        callback()
    },

    // Just for demonstration
    writableHighWaterMark: 1,
    readableHighWaterMark: 1
})

let asyncStream = new AsyncStream(stream)

let buffer = Buffer.from([0x11, 0x11, 0x11, 0xDD, 0x0F, 0x88, 0x33])

async function readTest(){

    assert(Buffer.compare(await asyncStream.readBuffer(buffer.byteLength), buffer) == 0)

    console.log("reading UInt8...")
    assert(await asyncStream.readUInt8() == 0xF0)
    console.log("reading Int8...")
    assert(await asyncStream.readInt8() == -99)

    console.log("reading UInt16BE...")
    assert(await asyncStream.readUInt16BE() == 0x1020)
    console.log("reading UInt16LE...")
    assert(await asyncStream.readUInt16LE() == 0x1021)
    console.log("reading Int16BE...")
    assert(await asyncStream.readInt16BE() == -0x1022)
    console.log("reading Int16LE...")
    assert(await asyncStream.readInt16LE() == -0x1023)

    console.log("reading UInt32BE...")
    assert(await asyncStream.readUInt32BE() == 0x10203040)
    console.log("reading UInt32LE...")
    assert(await asyncStream.readUInt32LE() == 0x10203041)
    console.log("reading Int32BE...")
    assert(await asyncStream.readInt32BE() == -0x10203042)
    console.log("reading Int32LE...")
    assert(await asyncStream.readInt32LE() == -0x10203043)

    console.log("reading UInt64BE...")
    assert(await asyncStream.readUInt64BE() == 0x1020304050607080n)
    console.log("reading UInt64LE...")
    assert(await asyncStream.readUInt64LE() == 0x1020304050607081n)
    console.log("reading Int64BE...")
    assert(await asyncStream.readInt64BE() == -0x1020304050607082n)
    console.log("reading Int64LE...")
    assert(await asyncStream.readInt64LE() == -0x1020304050607083n)

    console.log("reading FloatBE...")
    assert(Math.round(await asyncStream.readFloatBE() * 10) == 24)
    console.log("reading FloatLE...")
    assert(Math.round(await asyncStream.readFloatLE() * 10) == 28)

    console.log("reading DoubleBE...")
    assert(Math.round(await asyncStream.readDoubleBE() * 10) == 32)
    console.log("reading DoubleLE...")
    assert(Math.round(await asyncStream.readDoubleLE() * 10) == 34)

    console.log("reading String...")
    assert((await asyncStream.readString(21)) == "ascii test length: 21")
    console.log("reading Null Terminating String...")
    assert((await asyncStream.readNullTerminatingString()) == "Absolute random string with null at the end")
    console.log("reading String8...")
    assert((await asyncStream.readString8()) == "Max 255 symbols")
    console.log("reading String16BE...")
    assert((await asyncStream.readString16BE()) == "Max 65535 bytes")
    console.log("reading String16LE...")
    assert((await asyncStream.readString16LE()) == "Max 65535 bytes")
    console.log("reading String32BE...")
    assert((await asyncStream.readString32BE()) == "Max {big number} bytes")
    console.log("reading String32LE...")
    assert((await asyncStream.readString32LE()) == "Max {big number} bytes")
}

async function writeToStream(){

    asyncStream.writeBuffer(buffer)

    asyncStream.writeUInt8(0xF0)
    asyncStream.writeInt8(-99)

    asyncStream.writeUInt16BE(0x1020)
    asyncStream.writeUInt16LE(0x1021)
    asyncStream.writeInt16BE(-0x1022)
    asyncStream.writeInt16LE(-0x1023)

    asyncStream.writeUInt32BE(0x10203040)
    asyncStream.writeUInt32LE(0x10203041)
    asyncStream.writeInt32BE(-0x10203042)
    asyncStream.writeInt32LE(-0x10203043)

    asyncStream.writeUInt64BE(0x1020304050607080n)
    asyncStream.writeUInt64LE(0x1020304050607081n)
    asyncStream.writeInt64BE(-0x1020304050607082n)
    asyncStream.writeInt64LE(-0x1020304050607083n)

    asyncStream.writeFloatBE(2.4)
    asyncStream.writeFloatLE(2.8)

    asyncStream.writeDoubleBE(3.2)
    asyncStream.writeDoubleLE(3.4)

    asyncStream.writeString("ascii test length: 21")
    asyncStream.writeNullTerminatingString("Absolute random string with null at the end")
    asyncStream.writeString8("Max 255 symbols")
    asyncStream.writeString16BE("Max 65535 bytes")
    asyncStream.writeString16LE("Max 65535 bytes")
    asyncStream.writeString32BE("Max {big number} bytes")
    asyncStream.writeString32LE("Max {big number} bytes")

    await asyncStream.flush()
    console.log("Writed!")

}

readTest()
writeToStream()