'use strict';

const transport = {
  HTTP: 'http',
  WEBSOCKET: 'ws',
}
const chosenTransport = transport.HTTP;

const allMethods = {
  user: {
    create: ['record'],
    read: ['id'],
    update: ['id', 'record'],
    delete: ['id'],
    find: ['mask'],
  },
  country: {
    read: ['id'],
    delete: ['id'],
    find: ['mask'],
  },
};

const scaffold = (structure, selectedTransport, socket) => {
  const api = {};
  const services = Object.keys(structure);

  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);

    if (selectedTransport === transport.HTTP) {
      for (const methodName of methods) {
        api[serviceName][methodName] = async (...args) => {
          console.log('args')
          console.log(args)
          const url = `http://localhost:8001/${serviceName}/${methodName}/6`

          const rawResponse = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            // body: JSON.stringify({a: 1, b: 'Textual content'})
          });

          return rawResponse.json();
        }
      }
    } else if (chosenTransport === transport.WEBSOCKET) {
      for (const methodName of methods) {
        api[serviceName][methodName] = (...args) => new Promise((resolve) => {
          const packet = { name: serviceName, method: methodName, args };
  
          socket.send(JSON.stringify(packet));
          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            resolve(data);
          };
        })
      }
    } else {
      console.log('do not understand your protocol : ((')
    }
  }

  return api;
};


if (chosenTransport === transport.HTTP) {
  const api = scaffold(allMethods, chosenTransport);

  (async () => {
    const data = await api.user.read(6);
    console.log(data);
  })()
} else if (chosenTransport === transport.WEBSOCKET) {
  const socket = new WebSocket('ws://127.0.0.1:8001');
  const api = scaffold(allMethods, chosenTransport, socket);

  socket.addEventListener('open', async () => {
    const data = await api.user.read(6);
    console.log({ data });
  });
} else {
  console.log('unknown transport');
}
