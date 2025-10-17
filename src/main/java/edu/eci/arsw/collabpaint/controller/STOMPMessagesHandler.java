package edu.eci.arsw.collabpaint.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;

@Controller
public class STOMPMessagesHandler {

    @Autowired
    SimpMessagingTemplate msgt;

    @MessageMapping("/newpoint")
    public void handlePointEvent(Point pt) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor: " + pt);
        msgt.convertAndSend("/topic/newpoint", pt);
    }
}
