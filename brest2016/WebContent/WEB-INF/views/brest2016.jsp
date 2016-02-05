<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html ng-app="brest2016">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>Reservation de créneaux pour Brest 2016</title>
<link rel="stylesheet" type="text/css" href="style.css">
<script type="text/javascript" src="angular.js"></script>
<script type="text/javascript" src="brest2016.js"></script>

</head>


<body>

		<form ng-controller="Brest2016Control" ng-submit="ajouterAnimation()">
			<input type="text" ng-model="nom" />
			<input type="text" ng-model="texte" />
			<button>Add</button>

	<!-- 	</form> -->

	test
	<form ng-controller="Brest2016Control">
		<div
			ng-repeat="animation in animations = ( animations || recupererListeAnimations())">
			<li>{{animation.nom}} {{animation.texte}}
		</div>
	</form>
</body>
</html>

