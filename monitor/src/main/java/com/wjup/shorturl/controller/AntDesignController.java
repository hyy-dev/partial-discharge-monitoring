package com.wjup.shorturl.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AntDesignController {
    /**
     * 配置url通配符，拦截多个地址
     *
     * @return
     */
    @RequestMapping(value = {
            "/",
            "/user",
            "/user/**",
            "/record",
            "/record/**",
            "/list",
            "/alarms"
    })

    public String fowardIndex() {
        return "index";
    }
}