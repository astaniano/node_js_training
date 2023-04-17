// import http from 'node:http';
import http from './myHttp.mjs';

const port = 3001;

const server = http.createServer(async (req, res) => {
  req.on('data', (data) => {
    console.log(data.toString())
  })

  res.statusCode = 201;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('HMM', 'any');
  res.write('response body');
  res.end();
});

server.listen(
  port,
  () => {
    console.log(`Server running at port ${port}`);
  }
);
 