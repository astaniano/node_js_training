import net from 'node:net';
import { StringDecoder } from 'node:string_decoder';

function createServer(onClientReq) {
  const server = net.createServer(async (socket) => {
    let headersAreInTheStream = false;
    let startedWritingBodyToTheStream = false;

    const res = {
      statusCode: 200,
      setHeader(headerName, headerVal) {
        if (startedWritingBodyToTheStream) {
          throw new Error(`Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client`);  
        }
        if (!headersAreInTheStream) {
          socket.write(`HTTP/1.1 ${this.statusCode} OK\n`);
          headersAreInTheStream = true; 
        }

        socket.write(`${headerName} ${headerVal}\n`);
      },
      write(chunk) {
        if (!headersAreInTheStream) {
          socket.write(`HTTP/1.1 ${this.statusCode} OK\n`);
          headersAreInTheStream = true; 
        }
        if (!startedWritingBodyToTheStream) {
          socket.write('\n');
        }

        socket.write(chunk);
        startedWritingBodyToTheStream = true;
      },
      end(lastMsg) {
        if (lastMsg) {
          socket.end(lastMsg)
        }
        socket.end()
      }
    }
    
    const decoder = new StringDecoder('utf8');

    const errCallback = (e) => { console.log('ff'); } 
    socket.on('error', errCallback);
    socket.on('readable', onReadable);

    let headers = '';
    async function onReadable() {
      let chunk;
      while (null !== (chunk = socket.read())) {
        const str = decoder.write(chunk);

        if (str.indexOf('\r\n\r\n') > -1) {
          // Found the header boundary.
          const split = str.split('\r\n\r\n');
          headers += split.shift();

          const remaining = split.join();
          const buf = Buffer.from(remaining, 'utf8');

          socket.removeListener('error', errCallback);
          socket.removeListener('readable', onReadable);

          if (buf.length) {
            socket.unshift(buf);
          }
          
          await onClientReq(socket, res)
        }

        headers += str;
      }
    }
  }).on('error', (err) => {
    throw err;
  });

  return server; 
}

export default {
  createServer
}
