const socketIo = require('socket.io');
const http = require("http")
const readline = require('readline');
const { io: io1 } = require("socket.io-client");
const { io: io2  } = require("socket.io-client1");
const { io: io3 } = require("socket.io-client2");
const { io: io4 } = require("socket.io-client3");

const delay = ms => new Promise(res => setTimeout(res, ms));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Iniciando server

class Processo1 {
    constructor () {
        this.serverNumber = 1;
        this.server = http.createServer(function(req,res){
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Request-Method', '*');
            res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
            res.setHeader('Access-Control-Allow-Headers', '*');
            if ( req.method === 'OPTIONS' ) {
                res.writeHead(200);
                res.end();
                return;
            }
        });
        this.server.listen(1000);
        
        this.io = socketIo(this.server, {
            cors: {
              origin: "*",
              methods: ["GET"],
            }
          });   
          
        this.io.on('connection', (socket) => {
            console.log('Processo1: nova conexão')
        })
    }
    async conectarOutrosServidores () {
        let servidoresRede = [1, 2, 3, 4]
        try {
            this.server3 = await io1("http://localhost:3000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 3);
        }
        try {
            this.server2 = await io1("http://localhost:2000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 2);
        }

        try {
            this.server4 = await io1("http://localhost:4000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 4);
        }
    }

    setarCoordenador(coordenador) {
        this.coordenador = coordenador;
    }
}
class Processo2 {
    constructor () {
        this.serverNumber = 2;
        this.server = http.createServer(function(req,res){
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Request-Method', '*');
            res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
            res.setHeader('Access-Control-Allow-Headers', '*');
            if ( req.method === 'OPTIONS' ) {
                res.writeHead(200);
                res.end();
                return;
            }
        });
        this.server.listen(2000);
        
        this.io = socketIo(this.server, {
            cors: {
              origin: "*",
              methods: ["GET"],
            }
          });     
          
          this.io.on('connection', (socket) => {
            console.log('Processo2: nova conexão')

            
            socket.on('health', () => {
                socket.emit('health-response')
            })

            this.io.on('health', () => {
                console.log('teste')
            })
        }) 
          
    }

    async conectarOutrosServidores () {
        let servidoresRede = [1, 2, 3, 4]
        try {
            this.io
            this.server1 = await io2("http://localhost:1000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 1);
        }
        try {
            this.server3 = await io2("http://localhost:3000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 3);
        }

        try {
            this.server4 = await io2("http://localhost:4000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 4);
        }

        const myIndex = servidoresRede.findIndex(s => s === this.serverNumber);
        this.sucessor = servidoresRede?.[myIndex+1] || servidoresRede?.[0];
    }
    
    setarCoordenador(coordenador) {
        this.coordenador = coordenador;
    }
}

class Processo3 {
    constructor () {
        this.serverNumber = 3;
        this.server = http.createServer(function(req,res){
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Request-Method', '*');
            res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
            res.setHeader('Access-Control-Allow-Headers', '*');
            if ( req.method === 'OPTIONS' ) {
                res.writeHead(200);
                res.end();
                return;
            }
        });
        this.server.listen(3000);
        
        this.io = socketIo(this.server, {
            cors: {
              origin: "*",
              methods: ["GET"],
            }
          });    
          
        
          this.io.on('connection', (socket) => {
            console.log('Processo3: nova conexão')

            socket.on('health', () => {
                console.log('Health')
                socket.emit('health-response')
            })
        })
    }

    async conectarOutrosServidores() {

        let servidoresRede = [1, 2, 3, 4]
        try {
            this.server1 = await io("http://localhost:1000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 1);
        }
        try {
            this.server2 = await io("http://localhost:2000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 2);
        }

        try {
            this.server4 = await io("http://localhost:4000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 4);
        }

        this.servers = {
            server1: this.server1,
            server2: this.server2,
            server3: this.server3,

        }

        const myIndex = servidoresRede.findIndex(s => s === this.serverNumber);
        this.sucessor = servidoresRede?.[myIndex+1] || servidoresRede?.[0];
        this.servidoresRede = servidoresRede;
    }

    setarCoordenador(coordenador) {
        this.coordenador = coordenador;
    }

    verificarCoordenador () {
        console.log('Processo 3: Emiti Health', this.coordenador, this.servidoresRede)
        this.servers[`server${this.coordenador}`].emit('health')

    }
}

class Processo4 {
    constructor () {
        this.serverNumber = 4;
        this.server = http.createServer(function(req,res){
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Request-Method', '*');
            res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
            res.setHeader('Access-Control-Allow-Headers', '*');
            if ( req.method === 'OPTIONS' ) {
                res.writeHead(200);
                res.end();
                return;
            }
        });
        this.server.listen(4000);
        
        this.io = socketIo(this.server, {
            cors: {
              origin: "*",
              methods: ["GET"],
            }
          });   
        
          this.io.on('connection', (socket) => {
            console.log('Processo4: nova conexão')
        })
    }

    async conectarOutrosServidores () {  
        let servidoresRede = [1, 2, 3, 4]
        try {
            this.server1 = await io("http://localhost:1000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 1);
        }
        try {
            this.server2 = await io("http://localhost:2000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 2);
        }

        try {
            this.server3 = await io("http://localhost:3000");
        } catch (err) {
            console.log('Erro', err)
            servidoresRede = servidoresRede.filter(s => s !== 3);
        }

        const myIndex = servidoresRede.findIndex(s => s === this.serverNumber);
        this.sucessor = servidoresRede?.[myIndex+1] || servidoresRede?.[0];
    }

    setarCoordenador(coordenador) {
        this.coordenador = coordenador;
    }
}


async function levantarProcessos() {
    
    // const processo1 = new Processo1();
    const processo2 = new Processo2();
    const processo3 = new Processo3();
    // const processo4 = new Processo4();

    // const processos = {
    //     processo1,
    //     processo2,
    //     processo3,
    //     processo4
    // }

    // const coordenador = Math.floor(Math.random() * 4) + 1
    const coordenador = 2;

    console.log(coordenador)
    // processo1.conectarOutrosServidores()
    // processo1.setarCoordenador(coordenador)

    processo2.conectarOutrosServidores()
    processo2.setarCoordenador(coordenador)

    processo3.conectarOutrosServidores()
    processo3.setarCoordenador(coordenador)
    await delay(2000)
    processo3.verificarCoordenador()

    // processo4.conectarOutrosServidores()
    // processo4.setarCoordenador(coordenador)


    function coordenadorCai() {

    }


    function processosInativos() {

    }


    function percebendoInatividadeCoordenador() {

    }
}

levantarProcessos()

/*
const server = http.createServer(function(req,res){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	}
});
server.listen(8080);

const IO = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET"],
    }
  });
  

// Iniciando relógio

let relogioServer = new Date().getTime()

const interval = setInterval(() => {
    relogioServer += 1000;
    // console.log('Hora: ', relogioServer, new Date(relogioServer))
}, 1000)


const SERVERS =  {
}


IO.on('connection', socket => {
    console.log('nova conexão')
    socket.on('informando-horario', ({ server, relogio }) => {
        SERVERS[server] = relogio;
        console.log(SERVERS, Object.keys(SERVERS))

        if (Object.keys(SERVERS).length === 4) {
            const diferencaHora1 = relogio - SERVERS['1'];
            const diferencaHora2 = relogio - SERVERS['2'];
            const diferencaHora3 = relogio - SERVERS['3'];
            const diferencaHora4 = relogio - SERVERS['4'];

            const media = (diferencaHora1 + diferencaHora2 + diferencaHora3 + diferencaHora4) / 4
            console.log('A media é essa ', media)
            // atualiza hora com as médias e manda evento de atualização para todos
            relogioServer += media;

            console.log('Nova hora, ', relogioServer)

            IO.emit('atualizar-horario', { relogioServer })
            clearInterval(interval)
            setInterval(() => {
                relogioServer += 1000;
                console.log('Hora: ', relogioServer, new Date(relogioServer))
            }, 1000)

        }
    })
})
const delay = ms => new Promise(res => setTimeout(res, ms));

async function start() {
    while (true) {
        rl.question('Aperte enter para solicitar horários: ', function (matricula) {
            // socket.emit('login', { matricula, senha })
            console.log('Solicitando horários')
            IO.emit('hora-solicitada', {})
            rl.close();
        });
    
        await delay(3000)
    }
}

start()
*/