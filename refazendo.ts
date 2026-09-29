interface sobTempo{
    novoTurno(): void
}

class Jogo implements sobTempo{

    private personagens: Personagem[] = []
    private objtosTempo: sobTempo[] = []

    addPersonagem(pers: Personagem){
        this.personagens.push(pers)
    }

    addObjeto(objt: sobTempo){
        this.objtosTempo.push(objt)
    }

    novoTurno(){
        this.objtosTempo.forEach(i => i.novoTurno())
    }
}

class Cooldown implements sobTempo{

    private turnosRestantes: number = 0

    constructor(private duracao: number){}

    init(){
        this.turnosRestantes = this.duracao
    }

    estado(): boolean{
        return this.turnosRestantes === 0
    }

    novoTurno(): void {
        if(this.turnosRestantes > 0) this.turnosRestantes --
    }
}

interface Item{
    nome: string
    valor: number
    usar(atacante: Personagem, alvo: Personagem): void
}

class Inventario{
    private itens: Item[] = []

    add(item: Item){
        this.itens.push(item)
    }

    remov(nomeItem: string){
        this.itens = this.itens.filter(i => i.nome !== nomeItem)
    }

    usar(nomeItem: string, atacante: Personagem, alvo: Personagem){
        const item = this.itens.find(i => i.nome === nomeItem)
        if(!item){
            console.log(`${nomeItem} não encontrado`)
        }else{
            item.usar(atacante, alvo)
            this.remov(nomeItem)
        }
    }

    list(){
        this.itens.forEach(i => console.log(`- ${i.nome}`))
    }
}

class Pocao implements Item{

    nome: string
    valor: number
    cura: number

    constructor(nome: string, valor: number, cura: number){
        this.nome = nome
        this.valor = valor
        this.cura = cura
    }

    usar(atacante: Personagem, alvo: Personagem){
        alvo.recebeCura(this.cura)
    }
}

interface Arma extends sobTempo{
    nome: string
    atacar(atacante: Personagem, alvo: Personagem): void
}

class Espada implements Arma{

    nome: string
    dano: number
    cooldown: Cooldown

    constructor(nome: string){
        this.nome = nome
        this.dano = 15
        this.cooldown = new Cooldown(1)
    }

    atacar(atacante: Personagem, alvo: Personagem){
        if(!atacante.taVivo()){
            return
        }

        if(!alvo.taVivo()){
            console.log(`${alvo.nome} está morto.`)
            return
        }

        if(!this.cooldown.estado()){
            console.log(`${this.nome} está em cooldown.`)
            return
        }

        alvo.recebeDano(this.dano)
        this.cooldown.init()
    }

    novoTurno(){
        this.cooldown.novoTurno()
    }
}

class Arco implements Arma{

    nome: string
    dano: number
    flechas: number
    cooldown: Cooldown

    constructor(nome: string, flechas: number){
        this.nome = nome
        this.dano = 20
        this.flechas = flechas
        this.cooldown = new Cooldown(2)
    }

    atacar(atacante: Personagem, alvo: Personagem){
        if(!atacante.taVivo()){
            return
        }

        if(!alvo.taVivo()){
            console.log(`${alvo.nome} está morto.`)
            return
        }

        if(!this.cooldown.estado()){
            console.log(`${this.nome} está em cooldown.`)
            return
        }

        if(this.flechas <= 0){
            console.log(`${this.nome} está sem flechas.`)
            return
        }

        alvo.recebeDano(this.dano)
        this.cooldown.init()
    }

    novoTurno(){
        this.cooldown.novoTurno()
    }
}

class Varinha implements Arma{

    nome: string
    dano: number
    custoMana: number
    cooldown: Cooldown

    constructor(nome: string){
        this.nome = nome
        this.dano = 30
        this.custoMana = 10
        this.cooldown = new Cooldown(3)
    }

    atacar(atacante: Personagem, alvo: Personagem){
        if(!atacante.taVivo()){
            return
        }

        if(!alvo.taVivo()){
            console.log(`${alvo.nome} está morto.`)
            return
        }

        if(!this.cooldown.estado()){
            console.log(`${this.nome} está em cooldown.`)
            return
        }

        if(!atacante.gastaMana(this.custoMana)){
            console.log(`${atacante.nome} não tem mana suficiente.`)
            return
        }

        alvo.recebeDano(this.dano)
        this.cooldown.init()
    }

    novoTurno(){
        this.cooldown.novoTurno()
    }
}

class Personagem implements sobTempo{

    nome: string
    private vida: number
    private vidaMax: number
    private mana: number
    private manaMax: number
    private exp: number
    private nivel: number
    private inventario: Inventario

    constructor(nome: string, vidaMax: number, manaMax: number){
        this.nome = nome
        this.vidaMax = vidaMax
        this.vida = vidaMax
        this.manaMax = manaMax
        this.mana = manaMax
        this.exp = 0
        this.nivel = 1
        this.inventario = new Inventario
    }

    addItem(item: Item){
        this.inventario.add(item)
    }

    usarItem(nomeItem: string, alvo: Personagem){
        this.inventario.usar(nomeItem, this, alvo)
        this.inventario.remov(nomeItem)
    }

    listarItens(){
        console.log(`===== Itens =====`)
        this.inventario.list()
    }

    taVivo(): boolean{
        return this.vida > 0
    }

    recebeDano(dano: number){
        if(!this.taVivo()) return
        const temp = this.vida - dano

        if(temp < 0){
            this.vida = 0
            console.log(`${this.nome} recebeu ${dano - this.vida} de dano.`)
        }else{
            this.vida -= dano
            console.log(`${this.nome} recebeu ${dano} de dano.`)
        }
    }

    recebeCura(cura: number){
        if(!this.taVivo()) return
        const temp = this.vida + cura

        if(temp > this.vidaMax){
            this.vida = this.vidaMax
            console.log(`${this.nome} curou ${this.vidaMax - this.vida}HP.`)
        }else{
            this.vida += cura
            console.log(`${this.nome} curou ${cura}HP.`)
        }
    }

    gastaMana(quant: number): boolean{
        if(this.mana < quant){
            return false
        }else{
            this.mana -= quant
            return true
        }
    }

    novoTurno(): void {
        
    }
}

const pocao = new Pocao("Poção de Cura", 10, 20)
const guerreiro = new Personagem("Carlos", 50, 10)

guerreiro.addItem(pocao)
guerreiro.listarItens()
guerreiro.recebeDano(30)
guerreiro.usarItem("Poção de Cura", guerreiro)
guerreiro.listarItens()