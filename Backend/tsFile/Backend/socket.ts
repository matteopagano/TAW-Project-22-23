const socketIo = require('socket.io');

let io; // Mantieni un riferimento all'istanza di Socket.IO o al server socket

function initializeSocket(server) {
  //io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Un cliente si è connesso');

    // Gestisci la stanza in cui l'utente è interessato (il ristorante)
    socket.on('joinRestaurant', (restaurantId) => {
      socket.join(`restaurant-${restaurantId}`);
    });

    socket.on('fetchTable', (data) => {
        // Qui puoi gestire la richiesta di fetch, eseguire eventuali azioni necessarie
        // E quindi notificare tutti i client nella stanza del ristorante specificato
        io.to(`restaurant-${data.restaurantId}`).emit('fetchTableNeeded');
      });

    // Gestisci la disconnessione del client
    socket.on('disconnect', () => {
      console.log('Un cliente si è disconnesso');
    });
  });
}

function emitUpdateSignal(restaurantId) {
  if (io) {
    io.to('restaurant-room-' + restaurantId).emit('aggiornaVista');
  }
}

module.exports = { initializeSocket, emitUpdateSignal };