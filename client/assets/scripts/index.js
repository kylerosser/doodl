document.addEventListener("DOMContentLoaded", () => {
    console.log("Something something something...")
    console.log("Just making sure socket.io exists and is working")
    console.log(io)

    const gameCanvas = document.getElementById("gameCanvas")
    const ctx = gameCanvas.getContext("2d");

    resizeCanvas()

    function resizeCanvas() {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        gameCanvas.width = vw * 0.4 * 1.777
        gameCanvas.height = vw * 0.4

        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "red";
        ctx.rect(10, 10, gameCanvas.width - 12, gameCanvas.height - 12);
        ctx.stroke();
    }

    window.addEventListener("resize", resizeCanvas)
})