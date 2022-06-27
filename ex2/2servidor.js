// node ex2/2servidor.js
const readline = require('readline');
const delay = ms => new Promise(res => setTimeout(res, ms));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Iniciando server

class Base {
    constructor (number) {
        this.isOnline = true;
        this.serverNumber = number;
    }
    setIsOnline (state) {
        this.isOnline = state;
    }

    isOnline () {
        return this.isOnline;
    }

    proximoAtivo() {
        let sucessor = this.sucessor;
        let iteracoes = 0
        while (!this.servers?.[sucessor]?.isOnline && iteracoes < 5) {
            if (sucessor === 4) {
                sucessor = 1
            } else {
                sucessor += 1;
            }
            iteracoes+= 1;
        }

        return iteracoes === 5 ? 0 : sucessor;
    }

    enviarMensagemEleicao(sucessor, mensagem) {
        console.log(`[${this.serverNumber}] ` +'Enviando mensagem de coordenador para ', sucessor, mensagem)
        this.servers[sucessor].receberMensagemEleicao([...mensagem, this.serverNumber])
    }

    definirNovoCoordenador(novoCoordenador, mensagem) {
        let sucessorAtivo = this.proximoAtivo()
        if (mensagem.length > 0) {   
            this.servers[String(sucessorAtivo)].definirNovoCoordenador(novoCoordenador, mensagem.filter(p => p !== this.serverNumber))
            this.coordenador = novoCoordenador
            console.log(`[${this.serverNumber}] ` +'Setando coordenador', novoCoordenador)
        }
    }

    receberMensagemEleicao(mensagem) {
        console.log(`[${this.serverNumber}] ` +'recebi mensagem eleição', mensagem)

        if (mensagem.includes(this.serverNumber)) {
            const novoCoordenador = Math.max(...mensagem);

            console.log(`[${this.serverNumber}] ` +'Fez a volta', mensagem, novoCoordenador)
            this.definirNovoCoordenador(novoCoordenador, mensagem.filter(p => p !== this.serverNumber));

        } else {
            let sucessorAtivo = 0;

            sucessorAtivo = this.proximoAtivo()
            // console.log(`[${this.serverNumber}] ` + 'Enviando mensagem para ', sucessorAtivo)
            this.enviarMensagemEleicao(sucessorAtivo, mensagem)
        }
     }

     comecarEleicao() {
        // cpntata o sucessor
        let sucessorAtivo = this.sucessor;
        if (this.servers[String(this.sucessor)].isOnline) {
            console.log('[3] sucessor está online:', this.sucessor)
        } else {
            console.log('[3] sucessor não está online:', this.sucessor)

            sucessorAtivo = this.proximoAtivo()

        }

        if (sucessorAtivo === 0) {
            //lança erro
        } else {
            this.enviarMensagemEleicao(sucessorAtivo, [])
        }

    }

    verificarCoordenador() {
        if (!this.servers[String(this.coordenador)].isOnline) {
            console.log(`[${this.serverNumber}] ` + 'Coordenador não está online', this.coordenador, " começando o processo de eleição")
            this.comecarEleicao()
        } else {
            console.log(`[${this.serverNumber}] ` + 'Coordenador está online', this.coordenador)
        }
    }
}

class Processo1 extends Base {
    constructor () {
        super(1);
        
    }
    conectarOutrosServidores (p2, p3, p4) {
        const processosAtivos = [];
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

        const myIndex = processosAtivos.findIndex(s => s === this.serverNumber + 1);
        this.sucessor = processosAtivos?.[myIndex] || processosAtivos?.[0];
    }

    setarCoordenador(coordenador) {
        this.coordenador = coordenador;
    }

}

class Processo2 extends Base {
    constructor () {
        super(2)
        
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

        const myIndex = processosAtivos.findIndex(s => s === this.serverNumber + 1);
        this.sucessor = processosAtivos?.[myIndex] || processosAtivos?.[0];
    }

    setarCoordenador(coordenador) {
        this.coordenador = coordenador;
    }

}

class Processo3 extends Base {
    constructor () {
        super(3)
        
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
        const myIndex = processosAtivos.findIndex(s => s === this.serverNumber + 1);
        this.sucessor = processosAtivos?.[myIndex] || processosAtivos?.[0];
    }

    setarCoordenador(coordenador) {
        this.coordenador = coordenador;
    }

    

  
}

class Processo4 extends Base {
    constructor () {
        super(4)
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
        const myIndex = processosAtivos.findIndex(s => s === this.serverNumber + 1);
        this.sucessor = processosAtivos?.[myIndex] || processosAtivos?.[0];
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
    const coordenador = 4;

    processo1.setarCoordenador(coordenador)
    processo2.setarCoordenador(coordenador)
    processo3.setarCoordenador(coordenador)
    processo4.setarCoordenador(coordenador)

    processo1.conectarOutrosServidores(processo2, processo3, processo4)
    processo2.conectarOutrosServidores(processo1, processo3, processo4)
    processo3.conectarOutrosServidores(processo1, processo2, processo4)
    processo4.conectarOutrosServidores(processo1, processo2, processo4)

    function coordenadorCai() {

       function printarCoordenadores () {
        console.log('\n--- COORDENADORES ATUAIS ----')
        console.log('Processo1 está ', processo1.isOnline ? 'online' : 'offline', ' Seu coordenador é:',  processo1.coordenador)
        console.log('Processo2 está ', processo2.isOnline ? 'online' : 'offline', ' Seu coordenador é:',  processo2.coordenador)
        console.log('Processo3 está ', processo3.isOnline ? 'online' : 'offline', ' Seu coordenador é:',  processo3.coordenador)
        console.log('Processo4 está ', processo4.isOnline ? 'online' : 'offline', ' Seu coordenador é:',  processo4.coordenador)

    }

       printarCoordenadores()

        // processo2.setIsOnline(false);
        processo4.setIsOnline(false);
        // processo1.setIsOnline(false);

        processo3.verificarCoordenador()
        printarCoordenadores()

        processo4.setIsOnline(true);
        processo3.setIsOnline(false);

        processo2.verificarCoordenador()

        return;
    }

    coordenadorCai()


    function processosInativos() {

    }


    function percebendoInatividadeCoordenador() {

    }

    return ;
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