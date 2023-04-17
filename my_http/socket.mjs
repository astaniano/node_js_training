import net from 'node:net'

const client = net.createConnection({ port: 3001 }, () => {
  console.log('connected to server!');

  client.write('GET / HTTP/1.1\n');
  client.write('Host: localhost:3001\n');
  client.write('User-Agent: curl/7.68.0\n');
  client.write('Accept: */*\n\n');
});

client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});

client.on('end', () => {
  console.log('disconnected from server');
});
