interface sobTempo{
    novoTurno(): void
}

class Jogo implements sobTempo{

    private personagens: Personagem[] = []
    private objetosTempo: sobTempo[] = []

    addPersonagem(pers: Personagem): void{
        this.personagens.push(pers)
    }

    listPersonagem(): Personagem[]{
        return this.personagens
    }

    addObjeto(objt: sobTempo){
        this.objetosTempo.push(objt)
    }

    novoTurno(): void{
        this.objetosTempo.forEach(objt => objt.novoTurno())
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

    novoTurno(): void{
        if(this.turnosRestantes > 0){
            this.turnosRestantes--
        }
    }
}

interface Item{
    nome: string
    valor: number
}

class Inventario{

    private itens: Item[] = []

    add(item: Item){
        this.itens.push(item)
    }  

    remov(nomeItem: string){
        this.itens = this.itens.filter(i => i.nome !== nomeItem)
    }

    list(){
        for(const item of this.itens){
            console.log(`- ${item.nome}`)
        }
    } 
}

interface Arma extends sobTempo{
    nome: string
    atacar(atacante: Personagem, alvo: Personagem): void
}

class Espada implements Arma{

    nome: string
    private dano: number = 15
    private cooldown: Cooldown

    constructor(nome: string){
        this.nome = nome
        this.cooldown = new Cooldown(1)
    }

    atacar(atacante: Personagem, alvo: Personagem){
        if(!alvo.taVivo()){
            console.log(`${alvo.nome} está morto`)
            return
        }

        if(this.cooldown.estado()){
            alvo.recebeDano(this.dano)
            this.cooldown.init()
            return
        }

        console.log(`${this.nome} está recarregando`)
    }

    novoTurno(){
        this.cooldown.novoTurno()
    }
}

class Arco implements Arma{

    nome: string
    private dano: number
    private flechas: number
    private cooldown: Cooldown

    constructor(nome: string){
        this.nome = nome
        this.dano = 20
        this.flechas = 3
        this.cooldown = new Cooldown(2)
    }

    atacar(atacante: Personagem, alvo: Personagem){
        if(!alvo.taVivo()){
            console.log(`${alvo.nome} está morto`)
            return
        }

        if(this.flechas <= 0){
            console.log(`${this.nome} está sem flechas`)
            return
        }

        if(this.cooldown.estado()){
            alvo.recebeDano(this.dano)
            this.cooldown.init()
            this.flechas--
            return
        }

        console.log(`${this.nome} está em cooldown`)
    }

    recargaFlecha(){
        this.flechas = 3
        console.log(`${this.nome} está recarregado`)
    }

    novoTurno(){
        this.cooldown.novoTurno()
    }
}

class Varinha implements Arma{

    nome: string
    private dano: number
    private custoMana: number
    private cooldown: Cooldown

    constructor(nome: string){
        this.nome = nome
        this.dano = 30
        this.custoMana = 15
        this.cooldown = new Cooldown(3)
    }

    atacar(atacante: Personagem, alvo: Personagem){
        if(!alvo.taVivo()){
            console.log(`${alvo.nome} está morto`)
            return
        }

        if(!this.cooldown.estado()){
            console.log(`${this.nome} está em cooldown`)
            return
        }

        if(!atacante.gastarMana(this.custoMana)){
            console.log(`${atacante.nome} está sem mana suficiente`)
            return
        }

        alvo.recebeDano(this.dano)
        this.cooldown.init()
    }

    novoTurno(){
        this.cooldown.novoTurno()
    }
}

interface Efeito extends sobTempo{
    aplicar(alvo: Personagem): void
    estado(): boolean
}

class Veneno implements Efeito{

    private dano: number
    private alvo: Personagem
    private turnosRestantes: number

    constructor(alvo: Personagem, duracao: number){
        this.dano = 5
        this.alvo = alvo
        this.turnosRestantes = duracao
    }

    aplicar(alvo: Personagem){}

    estado(): boolean{
        return this.turnosRestantes === 0
    }

    novoTurno(){

        if(this.turnosRestantes > 0){
            this.alvo.recebeDano(this.dano)
            this.turnosRestantes--
        }
    }
}

class Regeneracao implements Efeito{

    private alvo: Personagem
    private regen: number
    private turnosRestantes: number

    constructor(alvo: Personagem, duracao: number){
        this.regen = 10
        this.alvo = alvo
        this.turnosRestantes = duracao
    }

    aplicar(alvo: Personagem){}

    estado(): boolean{
        return this.turnosRestantes === 0
    }

    novoTurno(){

        if(this.turnosRestantes > 0){
            this.alvo.recebeCura(this.regen)
            this.turnosRestantes--
        }
    }
}

interface Habilidade extends sobTempo{
    nome: string
    usar(usuario: Personagem, alvos: Personagem[]): void
}

class BoladeFogo implements Habilidade{

    nome: string
    private dano: number
    private custoMana: number
    private cooldown: Cooldown

    constructor(){
        this.nome = "Bola de Fogo"
        this.dano = 40
        this.custoMana = 20
        this.cooldown = new Cooldown(2)
    }

    usar(atacante: Personagem, alvos: Personagem[]){
        const alvo = alvos[0]
        if(!alvo.taVivo()){
            console.log(`${alvo.nome} está morto`)
            return
        }

        if(this.cooldown.estado()){
            console.log(`${this.nome} está em cooldown`)
            return
        }

        if(!atacante.gastarMana(this.custoMana)){
            console.log(`${atacante.nome} está sem mana suficiente`)
            return
        }

        console.log(`${atacante.nome} usou ${this.nome}`)
        alvo.recebeDano(this.dano)
        this.cooldown.init()
    }

    novoTurno(){
        this.cooldown.novoTurno()
    }
}

class Cura implements Habilidade{

    nome: string
    private cura: number
    private custoMana: number
    private cooldown: Cooldown

    constructor(){
        this.nome = "Cura"
        this.cura = 30
        this.custoMana = 15
        this.cooldown = new Cooldown(1)
    }

    usar(usuario: Personagem, alvos: Personagem[]){
        const alvo = alvos[0]
        if(!alvo.taVivo()) return

        if(!this.cooldown.estado()){
            console.log(`${this.nome} está em cooldown`)
            return
        }

        if(!usuario.gastarMana(this.custoMana)){
            console.log(`${usuario.nome} está sem mana suficiente`)
            return
        }

        console.log(`${usuario.nome} usou ${this.nome}`)
        alvo.recebeCura(this.cura)
        this.cooldown.init()
    }

    novoTurno(){
        this.cooldown.novoTurno()
    }
}

class GolpePoderoso implements Habilidade{

    nome: string
    private dano: number
    private cooldown: Cooldown

    constructor(){
        this.nome = "Golpe Poderoso"
        this.dano = 60
        this.cooldown = new Cooldown(3)
    }

    usar(atacante: Personagem, alvos: Personagem[]){
        const alvo = alvos[0]
        if(!alvo.taVivo()){
            console.log(`${alvo.nome} está morto`)
            return
        }

        if(this.cooldown.estado()){
            console.log(`${atacante.nome} usou ${this.nome}`)
            alvo.recebeDano(this.dano)
            this.cooldown.init()
            return
        }

        console.log(`${this.nome} está em cooldown`)
    }

    novoTurno(){
        this.cooldown.novoTurno()
    }
}

class Explosao implements Habilidade{

    nome: string
    private dano: number
    private custoMana: number
    private cooldown: Cooldown

    constructor(){
        this.nome = "Explosão"
        this.dano = 20
        this.custoMana = 25
        this.cooldown = new Cooldown(3)
    }

    usar(atacante: Personagem, alvos: Personagem[]){
        if(!this.cooldown.estado()){
            console.log(`${this.nome} está em cooldown`)
            return
        }

        if(!atacante.gastarMana(this.custoMana)){
            console.log(`${atacante.nome} está sem mana suficiente`)
            return
        }

        console.log(`${atacante.nome} usou ${this.nome}`)

        alvos.forEach(alvo => {
            if (alvo.taVivo()){
                alvo.recebeDano(this.dano)
            }
        })

        this.cooldown.init()
    }

    novoTurno(){
        this.cooldown.novoTurno()
    }
}

class ToqueVeneno implements Habilidade{

    nome: string
    private custoMana: number
    private cooldown: Cooldown

    constructor() {
        this.nome = "Toque de Veneno"
        this.custoMana = 20
        this.cooldown = new Cooldown(2)
    }

    usar(atacante: Personagem, alvos: Personagem[]){
        const alvo = alvos[0]
        if (!alvo || !alvo.taVivo()) return;

        if (!this.cooldown.estado()) {
            console.log(`${this.nome} está em cooldown`)
            return
        }

        if (!atacante.gastarMana(this.custoMana)) {
            console.log(`${atacante.nome} está sem mana suficiente`)
            return
        }

        console.log(`${atacante.nome} usou ${this.nome}. ${alvos[0].nome} foi envenenado por 3 turnos`)
        alvo.aplicaEfeito(new Veneno(alvo, 3))
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
    private nivel: number = 1
    private exp: number = 0

    private inventario: Inventario
    private armaEquip: Arma | null
    private habilitEquip: Habilidade[] = []
    private sobEfeito: Efeito[] = []

    constructor(nome: string, vidaMax: number, manaMax: number){
        this.nome = nome
        this.vidaMax = vidaMax
        this.vida = vidaMax
        this.manaMax = manaMax
        this.mana = manaMax

        this.armaEquip = null
        this.inventario = new Inventario()
    }

    equiparArma(arma: Arma){
        this.armaEquip = arma
        console.log(`${this.nome} equipou ${arma.nome}`)
    }

    equiparHabilt(habilidade: Habilidade){
        this.habilitEquip.push(habilidade)
        console.log(`${this.nome} equipou a habilidade ${habilidade.nome}`)
    }

    addItem(item: Item){
        this.inventario.add(item)
    }

    listarInventario(){
    console.log(`Inventário de ${this.nome}:`)
    this.inventario.list()
    }

    atacar(alvo: Personagem){
        if(!this.armaEquip){
            console.log(`${this.nome} não equipou uma arma`)
            return
        }
        
        console.log(`${this.nome} atacou ${alvo.nome}`)
        this.armaEquip.atacar(this, alvo)
    }

    usarHabilt(indice: number, alvo: Personagem[]){
        const habilt = this.habilitEquip[indice]
        if(!habilt){
            console.log(`${this.nome} não possui habilidade nesse espaço`)
            return
        }

        habilt.usar(this, alvo)
    }

    gastarMana(custo: number): boolean{
        const temp = this.mana - custo
        if(temp >= 0){
            this.mana -= custo
            return true
        }
        return false
    }

    recargaMana(){
        const quant = 20
        const temp = this.mana + quant
        if(temp > this.manaMax){
            console.log(`${this.nome} recarregou ${this.manaMax - this.mana} de mana`)
            this.mana = this.manaMax
        }else{
            this.mana += quant
            console.log(`${this.nome} recarregou ${quant} de mana`)
        }
    }

    taVivo(): boolean{
        return this.vida > 0
    }

    aplicaEfeito(efeito: Efeito){
        this.sobEfeito.push(efeito)
    }

    recebeDano(dano: number){
        const temp = this.vida - dano
        if(temp < 0){
            this.vida = 0
        }else{
            this.vida -= dano
            console.log(`${this.nome} recebeu ${dano} de dano`)
        }

        if(!this.taVivo()){
            console.log(`${this.nome} está morto`)
        }
    }

    recebeCura(cura: number){
        const temp = this.vida + cura
        if(temp > this.vidaMax){
            console.log(`${this.nome} curou ${this.vidaMax - this.vida}HP`)
            this.vida = this.vidaMax
        }else{
            this.vida += cura
            console.log(`${this.nome} curou ${cura}HP`)
        }
    }

    private subirNivel(){
        this.vidaMax += 10
        this.vida = this.vidaMax
        this.exp = 0
        this.nivel++
        console.log(`${this.nome} nivel ${this.nivel}`)
    }

    ganharExp(exp: number){
        this.exp += exp
        if(this.exp >= 100){
            this.subirNivel()
        }
    }

    novoTurno(){
        if(!this.taVivo()) return

        if(this.armaEquip){
            this.armaEquip.novoTurno()
        }

        this.habilitEquip.forEach(habilt => habilt.novoTurno())
        this.sobEfeito.forEach(efeito => efeito.novoTurno())
        this.sobEfeito = this.sobEfeito.filter(efeito => !efeito.estado())
    }
}

console.log("=== Config Inicial ===")

const partida = new Jogo()
const mago = new Personagem("Joao", 80, 100)       //P1
const guerreiro = new Personagem("Carlos", 100, 0) //P2
const ogro = new Personagem("Luiz", 120, 20)       //Inimigo

partida.addPersonagem(mago)
partida.addPersonagem(guerreiro)
partida.addPersonagem(ogro)
partida.addObjeto(mago)
partida.addObjeto(guerreiro)
partida.addObjeto(ogro)

const espadaLonga = new Espada("Espada Longa")
const arcoBasico = new Arco("Arco Basico")
const varinhaFogo = new Varinha("Varinha de Fogo")
mago.equiparArma(varinhaFogo)
guerreiro.addItem({nome: "Poção", valor: 10 })

mago.equiparHabilt(new Explosao())                 // indice 0
mago.equiparHabilt(new Cura())                     // indice 1
guerreiro.equiparHabilt(new GolpePoderoso())       // indice 0
ogro.equiparHabilt(new ToqueVeneno())              // indice 0

console.log("=== TURNO 1 ===")
guerreiro.usarHabilt(0, [ogro])
const listaDaPartida = partida.listPersonagem();
const inimigosMago = listaDaPartida.filter(alvo => alvo !== mago && alvo !== guerreiro && alvo.taVivo())
mago.usarHabilt(0, inimigosMago)

console.log("=== TURNO 2 ===")
partida.novoTurno()
ogro.usarHabilt(0, [guerreiro])

console.log("=== TURNO 3 ===")
partida.novoTurno()
mago.usarHabilt(1, [guerreiro])

console.log("=== TURNO 4 ===")
partida.novoTurno()
guerreiro.equiparArma(espadaLonga)
mago.usarHabilt(0, inimigosMago)
guerreiro.atacar(ogro)

console.log("=== TURNO 5 ===")
partida.novoTurno()
guerreiro.equiparArma(arcoBasico)
mago.recargaMana()
guerreiro.atacar(ogro)

mago.ganharExp(120)
guerreiro.ganharExp(120)