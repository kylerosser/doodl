document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content loaded")

    const gameCanvas = document.getElementById("gameCanvas")
    const ctx = gameCanvas.getContext("2d");
    const status = document.getElementById("status")
    const nicknameInput = document.getElementById("nicknameInput")
    const messageInput = document.getElementById("messageInput")
    const messagesContainer = document.getElementById("messagesContainer")

    const socket = io();

    let joinedRoom = false;

    socket.on("connect", () => {
        console.log("Connected")
        status.innerText = "You are spectating. Type a name to join"
        nicknameInput.focus()
    })

    socket.on("room join", ({ name }) => {
        addMessage("System", `${name} has just joined the room`, true)
    })

    socket.on("message", ({ name, content }) => {
        addMessage(name, content)
    })

    socket.on("joined", () => {
        nicknameModal.style.display = "none"
        messageInput.disabled = false;
        messageInput.placeholder = "(Press enter to focus)"
        joinedRoom = true;
    })

    // The user types a nickname then presses enter
    document.addEventListener("keydown", (evt) => {
        if (!evt || !evt.key) return

        if (joinedRoom) {
            if (evt.key === "Enter") {
                if (messageInput.value) {
                    socket.emit("message", { content: messageInput.value })
                    messageInput.value = ""
                } else {
                    messageInput.focus()
                }
            }
        } else {
            if (nicknameInput.value && evt.key === "Enter") socket.emit("join", { name: nicknameInput.value })
        }
    })

    resizeCanvas()

    function resizeCanvas() {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        gameCanvas.width = vw * 0.4 * 1.777
        gameCanvas.height = vw * 0.4
        messagesContainer.style.height = `${vw * 0.4}px`
        console.log(messagesContainer.style.maxHeight)
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

    function addMessage(name, content, bold = false) {
        const messageElement = messagesContainer.appendChild(document.createElement("div"))

        if (bold) messageElement.style.fontWeight = "bold"
        messageElement.innerText = `<${name}> ${content}`
    }

    window.addEventListener("resize", resizeCanvas)
})