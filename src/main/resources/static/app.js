var app = (function () {

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    var stompClient = null;

    var addPointToCanvas = function (point) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI); // círculo de radio 3
        ctx.fillStyle = "#000000";
        ctx.fill();
    };

    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);

            // Suscripción al tópico /topic/newpoint
            stompClient.subscribe('/topic/newpoint', function (eventbody) {
                var theObject = JSON.parse(eventbody.body);
                addPointToCanvas(theObject); // 🔹 dibuja directamente
            });
        });
    };

    var publishPoint = function (px, py) {
        var pt = new Point(px, py);
        addPointToCanvas(pt);
        console.info("Publicando punto: ", pt);
        stompClient.send("/app/newpoint", {}, JSON.stringify(pt)); // 🔹 usa /app/newpoint
    };

    return {

        init: function () {
            var canvas = document.getElementById("canvas");
            connectAndSubscribe();

            // Captura de eventos de clic
            canvas.addEventListener("click", function (event) {
                var rect = canvas.getBoundingClientRect();
                var x = event.clientX - rect.left;
                var y = event.clientY - rect.top;
                publishPoint(x, y);
            });
        }
    };

})();
