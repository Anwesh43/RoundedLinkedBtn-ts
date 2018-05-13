const w : number = window.innerWidth, h = window.innerHeight

class RoundedLinkedBtnStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')

    context : CanvasRenderingContext2D

    constructor() {
        this.initCanvas()
    }

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#212121'
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {

    }

    static init() {
        const stage = new RoundedLinkedBtnStage()
        stage.render()
        stage.handleTap()
    }
}
