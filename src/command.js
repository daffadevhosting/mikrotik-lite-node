function encodeLength(length) {
  if (length < 0x80) return Buffer.from([length]);
  else if (length < 0x4000)
    return Buffer.from([
      (length >> 8) | 0x80,
      length & 0xFF
    ]);
  else if (length < 0x200000)
    return Buffer.from([
      (length >> 16) | 0xC0,
      (length >> 8) & 0xFF,
      length & 0xFF
    ]);
  else if (length < 0x10000000)
    return Buffer.from([
      (length >> 24) | 0xE0,
      (length >> 16) & 0xFF,
      (length >> 8) & 0xFF,
      length & 0xFF
    ]);
  else
    return Buffer.from([
      0xF0,
      (length >> 24) & 0xFF,
      (length >> 16) & 0xFF,
      (length >> 8) & 0xFF,
      length & 0xFF
    ]);
}

function encodeSentence(words) {
  const buffers = [];
  for (const word of words) {
    const wordBuffer = Buffer.from(word, 'utf8');
    buffers.push(encodeLength(wordBuffer.length));
    buffers.push(wordBuffer);
  }
  buffers.push(Buffer.from([0])); // End of sentence
  return Buffer.concat(buffers);
}

function readLength(buffer, offset) {
  const first = buffer[offset];
  let length = 0;
  let size = 1;

  if ((first & 0x80) === 0x00) {
    length = first;
  } else if ((first & 0xC0) === 0x80) {
    length = ((first & 0x3F) << 8) + buffer[offset + 1];
    size = 2;
  } else if ((first & 0xE0) === 0xC0) {
    length = ((first & 0x1F) << 16) + (buffer[offset + 1] << 8) + buffer[offset + 2];
    size = 3;
  } else if ((first & 0xF0) === 0xE0) {
    length =
      ((first & 0x0F) << 24) +
      (buffer[offset + 1] << 16) +
      (buffer[offset + 2] << 8) +
      buffer[offset + 3];
    size = 4;
  } else if ((first & 0xF8) === 0xF0) {
    length =
      (buffer[offset + 1] << 24) +
      (buffer[offset + 2] << 16) +
      (buffer[offset + 3] << 8) +
      buffer[offset + 4];
    size = 5;
  }

  return { length, size };
}

function parseResponse(buffer) {
  const sentences = [];
  let offset = 0;

  while (offset < buffer.length) {
    const sentence = [];
    while (offset < buffer.length) {
      const { length, size } = readLength(buffer, offset);
      offset += size;
      if (length === 0) break; // End of sentence
      const word = buffer.slice(offset, offset + length).toString();
      sentence.push(word);
      offset += length;
    }
    if (sentence.length > 0) {
      sentences.push(sentence);
    }
  }

  return sentences;
}

module.exports = {
  encodeSentence,
  parseResponse
};
