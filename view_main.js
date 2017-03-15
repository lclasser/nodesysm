<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta charset="utf-8">

	<link rel="stylesheet" type="text/css" href="./side_menu.css">
    <link rel="stylesheet" href="//cdn.kendostatic.com/2013.1.319/styles/kendo.common.min.css" />
    <link rel="stylesheet" href="//cdn.kendostatic.com/2013.1.319/styles/kendo.blueopal.min.css" />

    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://kendo.cdn.telerik.com/2017.1.118/js/kendo.all.min.js"></script>

<!--
	<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
-->
	<script type="text/javascript">
		window.onload = function() {
			div2Resize();
			window.addEventListener('resize', div2Resize);

			if (!window.getComputedStyle) {
				window.getComputedStyle = function(element) {
					return element.currentStyle;
				}
			}
		}

		/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
		function openNav() {
			document.getElementById("mySidenav").style.width = "250px";
			/* document.getElementById("main").style.marginLeft = "250px"; */
		}

		/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
		function closeNav() {
			document.getElementById("mySidenav").style.width = "0";
			/* document.getElementById("main").style.marginLeft = "0"; */
		}

		function viewInfo() {
			/*
				document.getElementById("contents").innerHTML = "Changing..";
				document.getElementById("contents").href = "http://192.168.0.11:8081/view_cpu.js";
			*/
			$("#contentbody").load("view_cpu.js");
		}
		function viewTcp() {
			$("#contentbody").load("view_tcp.js");
		}

		function div2Resize() {
			/*
			var h1 = window.getComputedStyle(document.querySelector(".contenthead")).height;
			var h2 = window.getComputedStyle(document.querySelector(".contentmain")).height;
			
			var obj = document.querySelector(".contentbody");
			// window.getComputedStyle(obj).height = h2 - h1 - 200;
			// $("#contents").height( window.innerHeight - $("#header").height() - 20);
			*/
			/*
			var h1 = window.getComputedStyle(document.querySelector("#wrapperDiv")).height;
			var h2 = window.getComputedStyle(document.querySelector("#contenthead")).height;

			document.getElementById("contentbody").style.height = h1 - h2;
			*/
/*
			var h1 = document.getElementById("wrapperDiv").style.height;
			var h2 = document.getElementById("contenthead").style.height;
			document.getElementById("contentbody").style.height = h1 - h2;
*/
		}
	</script>
</head>

<body>
	<div id="wrapperDiv">
		<div id="mySidenav" class="sidenav">
			<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
			<a href="javascript:void(0)" onclick="viewInfo()"> Info </a>
			<a href="javascript:void(0)" onclick="viewTcp()"> TCP </a>
			<a href="javascript:void(0)">Clients</a>
			<a href="javascript:void(0)">Contact</a>
		</div>

		<div id="contenthead">
			<span style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776; open</span>
		</div>

	    <div id="contentbody" onclick="closeNav()">
	    	test...
	    </div>
	</div>
</body>
</html>
