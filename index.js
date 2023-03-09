class AsyncBinaryStream {

    #stream
    #writerBuffer = []

    constructor(stream){
        this.#stream = stream
    }

    // Reader methods

    async readBuffer(size){

        if(this.#stream.readableLength >= size){
            return this.#stream.read(size)
        }

        let buffer = []
        let readed = 0

        while(readed < size){
            await new Promise(resolve => {
                this.#stream.once("readable", resolve)
            })

            let howCanBeRead = Math.min(size - readed, this.#stream.readableLength)
            readed += howCanBeRead

            buffer.push(this.#stream.read(howCanBeRead))
        }

        if(readed > size){
            throw new Error("Unreachable")
        }

        return Buffer.concat(buffer)
    }

    async readUInt8(){ return (await this.readBuffer(1)).readUInt8() }
    async readInt8(){ return (await this.readBuffer(1)).readInt8() }

    async readUInt16BE(){ return (await this.readBuffer(2)).readUInt16BE() }
    async readUInt16LE(){ return (await this.readBuffer(2)).readUInt16LE() }

    async readInt16BE(){ return (await this.readBuffer(2)).readInt16BE() }
    async readInt16LE(){ return (await this.readBuffer(2)).readInt16LE() }

    async readUInt32BE(){ return (await this.readBuffer(4)).readUInt32BE() }
    async readUInt32LE(){ return (await this.readBuffer(4)).readUInt32LE() }

    async readInt32BE(){ return (await this.readBuffer(4)).readInt32BE() }
    async readInt32LE(){ return (await this.readBuffer(4)).readInt32LE() }

    async readUInt64BE(){ return (await this.readBuffer(8)).readBigUInt64BE() }
    async readUInt64LE(){ return (await this.readBuffer(8)).readBigUInt64LE() }

    async readInt64BE(){ return (await this.readBuffer(8)).readBigInt64BE() }
    async readInt64LE(){ return (await this.readBuffer(8)).readBigInt64LE() }

    async readFloatBE(){ return (await this.readBuffer(4)).readFloatBE() }
    async readFloatLE(){ return (await this.readBuffer(4)).readFloatLE() }

    async readDoubleBE(){ return (await this.readBuffer(8)).readDoubleBE() }
    async readDoubleLE(){ return (await this.readBuffer(8)).readDoubleLE() }

    async readString(length, encoding = "utf-8"){
        return new TextDecoder(encoding).decode(await this.readBuffer(length))
    }

    async #readStringWithSize(encoding, bits, isBE){
        let length = await this[`readUInt${bits}${bits != 8 ? (isBE ? "BE" : "LE") : ""}`]()
        return await this.readString(length, encoding)
    }

    readString8(encoding = "utf-8"){ return this.#readStringWithSize(encoding, 8, false) }
    readString16BE(encoding = "utf-8"){ return this.#readStringWithSize(encoding, 16, true) }
    readString16LE(encoding = "utf-8"){ return this.#readStringWithSize(encoding, 16, false) }
    readString32BE(encoding = "utf-8"){ return this.#readStringWithSize(encoding, 32, true) }
    readString32LE(encoding = "utf-8"){ return this.#readStringWithSize(encoding, 32, false) }
    

    async readNullTerminatingString(encoding = "utf-8"){
        let buffer = []
        let c
        while((c = (await this.readBuffer(1))[0]) != 0){
            buffer.push(c)
        }
        return new TextDecoder(encoding).decode(Buffer.from(buffer))
    }

    // Writer methods

    async flush(){
        let buffer = Buffer.concat(this.#writerBuffer)
        let needWrite = buffer.byteLength
        let maxChunkSize = this.#stream.writableHighWaterMark

        while(needWrite > 0){

            let canBeWrite = Math.min(maxChunkSize, needWrite)

            let ok = this.#stream.write(buffer.subarray(0, canBeWrite))

            if(!ok)
                await new Promise(resolve => this.#stream.once("drain", resolve))

            buffer = buffer.subarray(canBeWrite)
            needWrite -= canBeWrite
        }

        this.#writerBuffer = []

    }

    writeBuffer(buffer){
        this.#writerBuffer.push(Buffer.from(buffer))
    }


    #writeNumber(n, bits, isUnsigned, isBE){
        let buffer = Buffer.alloc(bits / 8);
        buffer[`write${bits == 64 ? "Big" : ""}${isUnsigned ? "U" : ""}Int${bits}${bits != 8 ? (isBE ? "BE" : "LE") : ""}`](n)
        this.#writerBuffer.push(buffer)
    }
    
    writeUInt8(n){ this.#writeNumber(n, 8, true, false) }
    writeInt8(n){ this.#writeNumber(n, 8, false, false) }

    writeUInt16BE(n){ this.#writeNumber(n, 16, true, true) }
    writeUInt16LE(n){ this.#writeNumber(n, 16, true, false) }
    writeInt16BE(n){ this.#writeNumber(n, 16, false, true) }
    writeInt16LE(n){ this.#writeNumber(n, 16, false, false) }

    writeUInt32BE(n){ this.#writeNumber(n, 32, true, true) }
    writeUInt32LE(n){ this.#writeNumber(n, 32, true, false) }
    writeInt32BE(n){ this.#writeNumber(n, 32, false, true) }
    writeInt32LE(n){ this.#writeNumber(n, 32, false, false) }

    writeUInt64BE(n){ this.#writeNumber(n, 64, true, true) }
    writeUInt64LE(n){ this.#writeNumber(n, 64, true, false) }
    writeInt64BE(n){ this.#writeNumber(n, 64, false, true) }
    writeInt64LE(n){ this.#writeNumber(n, 64, false, false) }

    writeFloatBE(n){
        let buffer = Buffer.alloc(4)
        buffer.writeFloatBE(n)
        this.#writerBuffer.push(buffer)
    }

    writeFloatLE(n){
        let buffer = Buffer.alloc(4)
        buffer.writeFloatLE(n)
        this.#writerBuffer.push(buffer)
    }

    writeDoubleBE(n){
        let buffer = Buffer.alloc(8)
        buffer.writeDoubleBE(n)
        this.#writerBuffer.push(buffer)
    }

    writeDoubleLE(n){
        let buffer = Buffer.alloc(8)
        buffer.writeDoubleLE(n)
        this.#writerBuffer.push(buffer)
    }

    writeString(string){
        let buffer = new TextEncoder().encode(string)
        this.#writerBuffer.push(buffer)
    }

    writeNullTerminatingString(string){
        let buffer = new TextEncoder().encode(string)

        let indexOfNull = buffer.indexOf(0x00)

        if(indexOfNull >= 0){
            this.#writerBuffer.push(buffer.subarray(0, indexOfNull + 1))
        }else{
            this.#writerBuffer.push(buffer)
            this.#writerBuffer.push(Buffer.from([0x00]))
        }
    }

    #writeStringWithSize(string, bits, isBE){
        let buffer = new TextEncoder().encode(string)

        if(buffer.byteLength >= (Math.pow(2, bits))){
            throw new Error("The length of utf8 string is out of range")
        }

        this[`writeUInt${bits}${bits != 8 ? (isBE ? "BE" : "LE") : ""}`](buffer.byteLength)
        this.writeBuffer(buffer)
    }

    writeString8(string){ this.#writeStringWithSize(string, 8, false) }
    writeString16BE(string){ this.#writeStringWithSize(string, 16, true) }
    writeString16LE(string){ this.#writeStringWithSize(string, 16, false) }
    writeString32BE(string){ this.#writeStringWithSize(string, 32, true) }
    writeString32LE(string){ this.#writeStringWithSize(string, 32, false) }

}

module.exports = AsyncStream