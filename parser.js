const { EventEmitter } = require('events');

const END = '\r\n';
const END_LENGTH = 2;

// Streaming JSON parser largely adapted from https://github.com/desmondmorris/node-twitter

class Parser extends EventEmitter {
  constructor() {
    super();
    this.buffer = '';
  }

  parse(chunk) {
    this.buffer += Buffer.from(chunk).toString('utf8');
    let index, json;

    // We have END?
    while ((index = this.buffer.indexOf(END)) > -1) {
      json = this.buffer.slice(0, index);
      this.buffer = this.buffer.slice(index + END_LENGTH);

      if (json.length > 0) {
        try {
          const data = JSON.parse(json);

          // Filter out non-tweet messages
          if (data.text != null && data.entities != null) {
            this.emit('data', data);
          }
        }
        catch (error) {
          error.source = json;
          this.emit('error', error);
        }
      }
    }
  };
}

module.exports = Parser;
