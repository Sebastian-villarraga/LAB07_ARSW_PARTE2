var app = (function () {

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    var stompClient = null;
    var drawingId = null; // identificador del dibujo

    // Dibuja un punto en el canvas
    var addPointToCanvas = function (point) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#000000";
        ctx.fill();
    };

    // Conexión al servidor y suscripción al tópico del dibujo
    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);

            // Obtiene el número del dibujo ingresado por el usuario
            drawingId = $("#drawingId").val();
            if (!drawingId) {
                alert("Por favor ingrese un número de dibujo antes de conectarse.");
                return;
            }

            // Se suscribe a un tópico dinámico
            var topic = "/topic/newpoint." + drawingId;
            console.log("Suscrito al tópico:", topic);

            stompClient.subscribe(topic, function (eventbody) {
                var theObject = JSON.parse(eventbody.body);
                addPointToCanvas(theObject);
            });
        });
    };

    // Publica un punto al tópico asociado al dibujo actual
    var publishPoint = function (px, py) {
        if (stompClient && drawingId) {
            var pt = new Point(px, py);
            addPointToCanvas(pt);
            console.info("Publicando punto en dibujo " + drawingId + ":", pt);

            stompClient.send("/app/newpoint." + drawingId, {}, JSON.stringify(pt));
        } else {
            alert("Debe conectarse primero a un dibujo antes de enviar puntos.");
        }
    };

    return {

        init: function () {
            var canvas = document.getElementById("canvas");

            // Captura de clics sobre el canvas
            canvas.addEventListener("click", function (event) {
                var rect = canvas.getBoundingClientRect();
                var x = event.clientX - rect.left;
                var y = event.clientY - rect.top;
                publishPoint(x, y);
            });

            // Botón de conexión
            $("#connect").click(function () {
                connectAndSubscribe();
            });
        }
    };

})();
