import { inherits } from "node:util";

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

    novoTurno(): void {
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

    constructor(nome: string, vidaMax: number, manaMax: number){
        this.nome = nome
        this.vidaMax = vidaMax
        this.vida = vidaMax
        this.manaMax = manaMax
        this.mana = manaMax
        this.exp = 0
        this.nivel = 1
    }

    taVivo(): boolean{
        return this.vida > 0
    }

    recebeDano(dano: number){
        if(!this.taVivo()) return
        const temp = this.vida - dano

        if(temp < 0){
            this.vida = 0
        }else{
            this.vida -= dano
        }
    }

    recebeCura(cura: number){
        if(!this.taVivo()) return
        const temp = this.vida + cura

        if(temp > this.vidaMax){
            this.vida = this.vidaMax
        }else{
            this.vida += cura
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