package ictgradschool.project.authentication;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;

@WebServlet(name = "log-out", urlPatterns = "/logout")
public class LogOut extends HttpServlet {

    // TODO do post, set user session back to null
}
