# AsyncBinaryStream

This library helps in developing or implementing protocols that use functions similar to those of DataView in asynchronous form.

Example of usage:
```js
const AsyncBinaryStream = require("async-binary-stream")

// "someDuplexStream" can be Readable but cannot be used for "write" and "flush" methods
// Same with Writable
// Can take Socket or another Duplex/Readable/Writable implementation
let binaryStream = new AsyncBinaryStream(someDuplexStream)

;(async () => {
    let num = await binaryStream.readUInt64BE()
    
    binaryStream.writeNullTerminatingString(`UInt64BE bytes: `)
    binaryStream.writeUInt64BE(num)
    
    // Send all writed data
    await binaryStream.flush()
})()

```
