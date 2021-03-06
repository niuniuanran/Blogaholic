<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <link rel="icon" href='<c:url value="/images/icon.png"/>'>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Goodbye, ${userLeft}</title>
    <script type="text/javascript">
        window.addEventListener("load", function () {
            setTimeout(function () {
                window.location.replace(`/team-java_blogaholic/index.jsp`);
            }, 5000);
            const countDownSpan = document.querySelector("#countdown-span");
            let currentTime = 5;
            setInterval(function () {
                countdown();
            }, 1000);

            function countdown() {
                currentTime -= 1;
                countDownSpan.innerText = currentTime;
            }

        });

    </script>

    <style>
        #goodbye {
            position: relative;
            top: 80px;
            color: #106688;
            font-family: 'Times New Roman', serif;
            text-align: center;
            font-weight: 800;
            width: 70vw;
            margin: 30px auto;
        }

        p {
            font-size: 30px;
        }

        #countdown-span {
            color: #3f99ae;
        }
    </style>

</head>
<body>
<div id="goodbye">
    <h1>
        Goodbye, ${userLeft}!</h1>
    <p>We will redirect you to our index page in <span id="countdown-span">5</span> seconds...</p>
    <p>Hope we'll see you again!</p>

</div>

</body>
</html>
