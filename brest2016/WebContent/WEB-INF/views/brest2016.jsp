<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html ng-app="brest2016App">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>Reservation de créneaux pour Brest 2016</title>
<link rel="stylesheet" type="text/css" href="style.css">
<script type="text/javascript" src="angular.js"></script>
<script type="text/javascript" src="brest2016Module.js"></script>
<script type="text/javascript" src="brest2016Controller.js"></script>
<script type="text/javascript" src="brest2016Service.js"></script>

</head>


<body>

	Write some text in textbox:
	<input type="text" ng-model="sometext" />

	<h1>Hello {{ sometext }}</h1>

	<div ng-controller="Brest2016Controller as vm">test {{vm.salut}}</div>

	<!-- 	as vm -->
	<!-- 	<form ng-controller="Brest2016Controller as vm" -->
	<!-- 		ng-submit=vm.diresalut()> -->
	<!-- 		<button>Add</button> -->
	<!-- 		{{vm.salut}} -->
	<!-- 	</form> -->




	<form ng-controller="Brest2016Controller as vm"
		ng-submit="vm.ajouterAnimation()">
		<input type="text" ng-model="vm.nom" /> <input type="text"
			ng-model="vm.texte" />
		<button>Add</button>
<!-- 		<div ng-init="vm.listerAnimations()"> -->
			<div ng-repeat="animation in vm.animations">
				<li>{{animation.nom}}
			</div>
<!-- 		</div> -->

	</form>

	<!-- 		test -->
	<!-- 	<br> liste animations -->
	<!-- 	<form ng-controller="Brest2016Controller as vm"> -->
	<!-- 		<div ng-init="vm.listerAnimations()"> -->
	<!-- 			<div ng-repeat="animation in vm.animations"> -->
	<!-- 				<li>{{animation.nom}} -->
	<!-- 			</div> -->
	<!-- 		</div> -->
	<!-- 	</form> -->

</body>
</html>

