const readline = require('readline');

const delay = ms => new Promise(res => setTimeout(res, ms));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Iniciando server

class Base {
    constructor () {
        this.isOnline = true;
    }
    setIsOnline (state) {
        this.isOnline = state;
    }

    isOnline () {
        return this.isOnline;
    }
}

class Processo1 extends Base {
    constructor () {
        super();
        
    }
    conectarOutrosServidores (p2, p3, p4) {
        const processosAtivos = [];
        console.log(p2)
        if (p2.isOnline) {
            processosAtivos.push(2)
        }
        if (p3.isOnline) {
            processosAtivos.push(3)
        }

        if (p4.isOnline) {
            processosAtivos.push(4)
        }

        this.servers = {
            '2': p2,
            '3': p3,
            '4': p4,
        }

        this.processosAtivos = processosAtivos;
    }

    setarCoordenador(coordenador) {
        this.coordenador = coordenador;
    }

}

class Processo2 extends Base {
    constructor () {
        super()
        
    }
    conectarOutrosServidores (p1, p3, p4) {
        const processosAtivos = [];
        if (p1.isOnline) {
            processosAtivos.push(1)
        }
        if (p3.isOnline) {
            processosAtivos.push(3)
        }

        if (p4.isOnline) {
            processosAtivos.push(4)
        }
        this.servers = {
            '1': p1,
            '3': p3,
            '4': p4,
        }
        this.processosAtivos = processosAtivos;
    }

    setarCoordenador(coordenador) {
        this.coordenador = coordenador;
    }

}

class Processo3 extends Base {
    constructor () {
        super()
        
    }
    conectarOutrosServidores (p1, p2, p4) {
        const processosAtivos = [];
        if (p1.isOnline) {
            processosAtivos.push(1)
        }
        if (p2.isOnline) {
            processosAtivos.push(2)
        }

        if (p4.isOnline) {
            processosAtivos.push(4)
        }

        this.servers = {
            '1': p1,
            '2': p2,
            '4': p4,
        }

        this.processosAtivos = processosAtivos;
    }

    setarCoordenador(coordenador) {
        this.coordenador = coordenador;
    }

    verificarCoordenador() {
        if (!this.servers[String(this.coordenador)].isOnline) {
            console.log('Coordenador não está online', this.coordenador)
        } else {
            console.log('Coordenador está online', this.coordenador)
        }
    }
}

class Processo4 extends Base {
    constructor () {
        super()
    }
    conectarOutrosServidores (p1, p2, p3) {
        const processosAtivos = [];
        if (p1.isOnline) {
            processosAtivos.push(1)
        }
        if (p2.isOnline) {
            processosAtivos.push(2)
        }

        if (p3.isOnline) {
            processosAtivos.push(3)
        }

        this.servers = {
            '2': p2,
            '3': p3,
            '1': p1,
        }

        this.processosAtivos = processosAtivos;
    }

    setarCoordenador(coordenador) {
        this.coordenador = coordenador;
    }

    isOnline() {
        return true;
    }
}


function levantarProcessos() {
    
    // Inicializando
    const processo1 = new Processo1();
    const processo2 = new Processo2();
    const processo3 = new Processo3();
    const processo4 = new Processo4();

    // const coordenador = Math.floor(Math.random() * 4) + 1
    const coordenador = 2;

    console.log(coordenador)
    processo1.setarCoordenador(coordenador)
    processo2.setarCoordenador(coordenador)
    processo3.setarCoordenador(coordenador)
    processo4.setarCoordenador(coordenador)

    processo1.conectarOutrosServidores(processo2, processo3, processo4)
    processo2.conectarOutrosServidores(processo1, processo3, processo4)
    processo3.conectarOutrosServidores(processo1, processo2, processo4)
    processo4.conectarOutrosServidores(processo1, processo2, processo4)

    function coordenadorCai() {
        processo2.setIsOnline(false);
        processo3.verificarCoordenador()
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