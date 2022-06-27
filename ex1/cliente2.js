const { io } = require("socket.io-client");

const socket = io("http://localhost:8080", {
  reconnectionDelayMax: 10000,
});


let relogio = new Date().getTime() - 10000

const interval = setInterval(() => {
    relogio += 1000;
    console.log('\nHora: ', relogio, new Date(relogio))
}, 1000)


socket.on('hora-solicitada', ({ }) => {
    socket.emit('informando-horario', { server: 2, relogio })
})

socket.on('atualizar-horario', ({ relogioServer }) => {
    relogio = relogioServer;
    console.log('Nova hora, ', relogioServer)

    clearInterval(interval)
    setInterval(() => {
        relogio += 1000;
        console.log('\nHora: ', relogio, new Date(relogio))
    }, 1000)
})