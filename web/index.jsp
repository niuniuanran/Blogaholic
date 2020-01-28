<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <%--TODO Create A LANDING PAGE --%>
<%--    TODO change the name BLOG to a nice name--%>

    <meta charset="UTF-8">
    <title>Welcome to BLOG</title>

        <jsp:include page="/cross-page-view/link-fonts.jsp"/>
        <link rel="stylesheet" href='<c:url value="/assets/cross-layout-style.css"/>'/>
        <link rel="stylesheet" href='<c:url value="/assets/layout1.css"/>'>
        <script src='<c:url value="/js/customized-styling.js"/>' type="text/javascript"></script>
        <script type="text/javascript">
            window.addEventListener("load", function () {
                loadAllBlogList();
               applyThemeColor(`#3f99ae`);
                applyLayoutSpecificStyling(`1`, `3f99ae`);
            })
        </script>


</head>
<body>

<div class="head-container">
    <div id="index-welcome-container" class="page-h1-container">
        <h1>
            Welcome to BLOG, where ideas sparkle
        </h1>
    </div>
    <button class="link-button">
        <a href='<c:url value="/signup.html"/>'>
            Create my blog &nbsp;&#8594;
        </a>
    </button>
</div>

<div class="body-container" id="all-blog-container">




</div>


</body>
</html>