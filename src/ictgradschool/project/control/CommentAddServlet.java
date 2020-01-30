package ictgradschool.project.control;

import ictgradschool.project.model.*;
import ictgradschool.project.util.DBConnectionUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet(name = "add-comment", urlPatterns = "/add-comment")
public class CommentAddServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try (Connection connection = DBConnectionUtils.getConnectionFromClasspath("connection.properties")) {
            int commenterID = ((User) request.getSession().getAttribute("loggedUser")).getUserID();
            String target = request.getParameter("target-type");
            int targetID = Integer.parseInt(request.getParameter("target-id"));
            int articleID = Integer.parseInt(request.getParameter("article-id"));
            Comment newComment = new Comment();
            newComment.setCommentBody(request.getParameter("article-comment-body"));
            newComment.setCommenterID(commenterID);

            CommentDAO.addComment(connection, (target.equals("article")), targetID, newComment);
            response.sendRedirect("./article-view?articleID=" + articleID);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}