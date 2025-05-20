function decodeLength(buffer, offset) {
  let len = buffer[offset++];
  if ((len & 0x80) === 0x00) {
    return [len, offset];
  } else if ((len & 0xC0) === 0x80) {
    len = ((len & 0x3F) << 8) + buffer[offset++];
    return [len, offset];
  } else if ((len & 0xE0) === 0xC0) {
    len = ((len & 0x1F) << 16) + (buffer[offset++] << 8) + buffer[offset++];
    return [len, offset];
  } else if ((len & 0xF0) === 0xE0) {
    len = ((len & 0x0F) << 24) + (buffer[offset++] << 16) + (buffer[offset++] << 8) + buffer[offset++];
    return [len, offset];
  } else if (len === 0xF0) {
    len = (buffer[offset++] << 24) + (buffer[offset++] << 16) + (buffer[offset++] << 8) + buffer[offset++];
    return [len, offset];
  } else {
    throw new Error('Unknown length encoding');
  }
}

function decodeSentence(buffer) {
  const words = [];
  let offset = 0;

  while (offset < buffer.length) {
    const [len, nextOffset] = decodeLength(buffer, offset);
    offset = nextOffset;
    const word = buffer.slice(offset, offset + len).toString('utf8');
    offset += len;
    words.push(word);
  }

  return words;
}

function parseResponse(buffer) {
  const words = decodeSentence(buffer);

  const objects = [];
  let current = {};

  for (const word of words) {
    if (word === '!re') {
      current = {};
    } else if (word.startsWith('=')) {
      const [key, value] = word.slice(1).split('=');
      current[key] = value;
    } else if (word === '!done') {
      if (Object.keys(current).length > 0) {
        objects.push(current);
      }
      break;
    }
  }

  return objects;
}

module.exports = { parseResponse };
