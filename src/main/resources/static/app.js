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
        ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
        ctx.stroke();
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
                alert("Nuevo punto recibido: X=" + theObject.x + ", Y=" + theObject.y);
            });
        });
    };

    return {

        init: function () {
            connectAndSubscribe();
        },

        publishPoint: function (px, py) {
            var pt = new Point(px, py);
            addPointToCanvas(pt);

            console.info("Publicando punto: ", pt);
            stompClient.send("/topic/newpoint", {}, JSON.stringify(pt));
        }
    };

})();
