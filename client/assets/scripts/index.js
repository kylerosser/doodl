document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content loaded")

    const gameCanvas = document.getElementById("gameCanvas")
    const ctx = gameCanvas.getContext("2d");
    const status = document.getElementById("status")

    const socket = io();

    socket.on("connect", () => {
        console.log("Connected")
        status.innerText = "You are spectating. Type a name to join"
    })

    resizeCanvas()

    function resizeCanvas() {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        gameCanvas.width = vw * 0.4 * 1.777
        gameCanvas.height = vw * 0.4
        draw()
    }

    function draw() {
        // Draw the things here

        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "white";
        ctx.rect(10, 10, gameCanvas.width - 12, gameCanvas.height - 12);
        ctx.stroke();
    }

    window.addEventListener("resize", resizeCanvas)
})