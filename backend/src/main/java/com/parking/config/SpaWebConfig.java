package com.parking.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaWebConfig {

    @GetMapping(value = {
            "/",
            "/{x:[\\w\\-]+}",
            "/{x:[\\w\\-]+}/{y:[\\w\\-]+}",
            "/{x:[\\w\\-]+}/{y:[\\w\\-]+}/{z:[\\w\\-]+}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
