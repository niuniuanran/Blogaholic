package ictgradschool.project.control;

import ictgradschool.project.model.User;
import ictgradschool.project.model.UserDAO;
import ictgradschool.project.util.DBConnectionUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;


/* Responsible for updating user's blog settings (name, description, layout, theme color) */

@WebServlet(name = "change-blog-preference", urlPatterns = "/change-blog-preference")
public class UserBlogSettingServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String themeColor = request.getParameter("theme-color");
        int layoutID = Integer.parseInt(request.getParameter("layout"));
        String blogName = request.getParameter("blog-name");
        String blogDescription = request.getParameter("blog-description");
        User user = (User) request.getSession().getAttribute("newUser");

        if (user == null) {
            response.sendRedirect("./index.jsp");
            return;
        }

        int userID = user.getUserID();

        try (Connection connection = DBConnectionUtils.getConnectionFromClasspath("connection.properties")) {
            UserDAO.setBlogPreference(connection, userID, blogName, blogDescription, layoutID, themeColor);
            user.setLayoutID(layoutID);
            user.setThemeColor(themeColor);
            user.setBlogName(blogName);
            user.setBlogDescription(blogDescription);
            request.getSession().setAttribute("loggedUser", user);
            response.sendRedirect("./blog-view?authorID=" + user.getUserID());

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
