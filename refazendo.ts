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

    novoTurno(): void {
        
    }
}