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
    let drawing = false;
    let current = {
        color: 'black'
    };

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

        gameCanvas.addEventListener('mousedown', onMouseDown, false);
        gameCanvas.addEventListener('mouseup', onMouseUp, false);
        gameCanvas.addEventListener('mouseout', onMouseUp, false);
        gameCanvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

        gameCanvas.addEventListener('touchstart', onMouseDown, false);
        gameCanvas.addEventListener('touchend', onMouseUp, false);
        gameCanvas.addEventListener('touchcancel', onMouseUp, false);
        gameCanvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);


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
        console.log(messagesContainer.style.maxHeight);
        // draw()
    }

    socket.on('draw', onDrawingEvent);

    function drawLine(x0, y0, x1, y1, color, emit) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        if (!emit) { return; }
        var w = gameCanvas.width;
        var h = gameCanvas.height;

        socket.emit('draw', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color
        });
    }

    function onMouseDown(e) {
        drawing = true;
        current.x = e.offsetX || e.touches[0].offsetX;
        current.y = e.offsetY || e.touches[0].offsetY;
    }

    function onMouseUp(e) {
        if (!drawing) { return; }
        drawing = false;
        drawLine(current.x, current.y, e.offsetX || e.touches[0].offsetX, e.offsetY || e.touches[0].offsetY, current.color, true);
    }

    function onMouseMove(e) {
        if (!drawing) { return; }
        drawLine(current.x, current.y, e.offsetX || e.touches[0].offsetX, e.offsetY || e.touches[0].offsetY, current.color, true);
        current.x = e.offsetX || e.touches[0].offsetX;
        current.y = e.offsetY || e.touches[0].offsetY;
    }

    function onColorUpdate(e) {
        current.color = e.target.className.split(' ')[1];
    }

    // limit the number of events per second
    function throttle(callback, delay) {
        var previousCall = new Date().getTime();
        return function() {
            var time = new Date().getTime();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }

    function onDrawingEvent(data) {
        console.log(data)
        var w = gameCanvas.width;
        var h = gameCanvas.height;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }

    function addMessage(name, content, bold = false) {
        const messageElement = messagesContainer.appendChild(document.createElement("div"))

        if (bold) messageElement.style.fontWeight = "bold"
        messageElement.innerText = `<${name}> ${content}`
    }

    window.addEventListener("resize", resizeCanvas)
})