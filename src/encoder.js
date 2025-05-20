function encodeLength(length) {
  if (length < 0x80) return Buffer.from([length]);
  if (length < 0x4000) return Buffer.from([
    (length >> 8) | 0x80,
    length & 0xFF
  ]);
  throw new Error('Length too long');
}

function encodeSentence(words) {
  const buffers = words.map(word => {
    const wordBuf = Buffer.from(word);
    return Buffer.concat([encodeLength(wordBuf.length), wordBuf]);
  });
  return Buffer.concat(buffers.concat([Buffer.from([0])]));
}

module.exports = { encodeSentence };
