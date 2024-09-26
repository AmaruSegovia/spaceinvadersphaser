export default class Enemigo{
    constructor(scene, x, y) {
        super(scene, x, y, 'asteroide'); // Ajusta 'enemigoImagen' a tu nombre de imagen

        this.vida = 100; // Inicializa la vida del enemigo
    }

    // Otros métodos y lógica de enemigo aquí
}