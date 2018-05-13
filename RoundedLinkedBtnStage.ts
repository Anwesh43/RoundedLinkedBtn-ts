const w : number = window.innerWidth, h : number = window.innerHeight, RLB_NODES = 5

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

class State {
    scales : Array<number> = [0, 0]
    dir : number = 0
    prevScale : number = 0
    j : number = 0

    update(stopcb : Function) {
        this.scales[this.j] += this.dir * 0.1
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }

    startUpdating(startcb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class Animator {

    animated : boolean = false

    interval : number

    start(updatecb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }

}

class RLBNode {

    prev : RLBNode

    next : RLBNode

    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    draw(context : CanvasRenderingContext2D) {
        const gap : number = (w / RLB_NODES)
        const r : number = gap / 10
        const draw180Arc = (ax, start, started) => {
            for (var i = start; i <= start + 180; i++) {
                const x : number = ax + r * Math.cos(i * Math.PI/180), y : number = r * Math.sin(i * Math.PI/180)
                if (i == start && started) {
                    context.moveTo(x, y)
                }
                else {
                    context.lineTo(x, y)
                }
            }
        }
        context.save()
        context.translate(this.i * (gap), h/2)
        context.beginPath()
        draw180Arc(r + (w - 2 * r) * this.state.scales[1], 90, true)
        draw180Arc(r + (w - 2 * r) * this.state.scales[1], 270, false)
        context.fill()
        context.restore()
    }

    addNeighbor() {
        if (this.i < RLB_NODES - 1) {
            const curr = new RLBNode(this.i + 1)
            this.next = curr
            curr.prev = this
        }
    }

    update(stopcb : Function) {
        this.state.update(stopcb)
    }

    startUpdating(startcb : Function) {
        this.state.update(startcb)
    }

    getNext(dir, cb) {
        var curr : RLBNode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}
