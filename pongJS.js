var difficulty;
var speed;
var control;
var counter;
var scoreL;
var scoreR;
var ballSpeedXY;
var ballTRCorner;
var leftPaddleTop;
var rightPaddleTop;
var rightPaddleSpeed;
var buttonPressed;
var numOfPlayers;
var localOrNetwork;
var buttonPlayer1;
var buttonPlayer2;

function initialSetting(){
	window.difficulty 		= -1;
	window.speed 			= -1;
	window.control			= -1;
	window.counter			= 3;
	window.scoreL			= 0;
	window.scoreR			= 0;
	window.ballSpeedXY		= new Array(-5,0);
	window.ballTRCorner		= new Array(435, 435);
	window.leftPaddleTop		= 375;
	window.rightPaddleTop		= 375;
	window.rightPaddleSpeed		= 0;
	window.buttonPressed 		= false;
	window.numOfPlayers		= -1;
	window.localOrNetwork		= -1;
	window.buttonPlayer1		= false;
	window.buttonPlayer2		= false;
}

initialSetting();

document.captureEvents(Event.MOUSEMOVE);
document.captureEvents(Event.MOUSECLICK);
document.onkeyup  = keyUp;
document.onmousemove = updatePaddle;
document.onkeydown  = isLegitButton;



function startPress(){
	setScoreR(0);
	setScoreL(0);
	$("#restart").hide();
	$("#reset").hide();
	$("#leftText").hide();
	$("#rightText").hide();
	$("#startDiv").hide();
	$("#player").show();
	return true;
}

function formPlayer(i){
	setNumOfPlayers(i);
	$("#player").hide();
	if(i == 1){
		$("#difficulty").show();
	}
	else{
		$("#localOrNetwork").show();
	}
	return true;
}

function formDifficulty(i){
	setDifficulty(i);
	$("#difficulty").hide();
	$("#speed").show();
	return true;
}

function formSpeed(i){
	setSpeed(i);
	$("#speed").hide();
	if(getNumOfPlayers() == 1){
		$("#controls").show();
	}
	else{
		startGame();
	}
	return true;
}

function formControls(i){
	setControl(i);
	$("#controls").hide();
	$("#counter").show();
	startGame();
	return true;
}

function formLON(i){
	setLocalOrNetwork(i);
	$("#localOrNetwork").hide();
	if(i == 1){
		$("#speed").show();
	}
	else{
		//not yet implemented
	}
	return true;
}

function startGame(){

	$("#scoreRight").html("0");
	$("#scoreLeft").html("0");

	setScoreR(0);
	setScoreL(0);
	setBallSpeedXY(-5,0);
	setBallTRCorner(435, 435);
	setRightPaddleTop(375);
	setCounter(3);

	$("#leftText").html("");
	$("#rightText").html("");

	$("#restart").hide();
	$("#reset").hide();
	$("#leftText").hide();
	$("#rightText").hide();

	$("#counter").html("3");
	$("#counter").show();	
	window.setTimeout('rewrite()', 1000);
	window.setTimeout('rewrite()', 2000);
	window.setTimeout('rewrite()', 3000);
	window.setTimeout('rewrite()', 4000);
	window.setTimeout('rewrite()', 4001);
}

function rewrite(){
	setCounter(getCounter() - 1);
	switch(getCounter()){
		case 2: $("#counter").html("2");
			break;
		case 1: $("#counter").html("1");
			break;
		case 0: $("#counter").html("GO!");
			break;
		case -1: $("#counter").hide();
			$("#ball").show();
			$("#paddleLeft").show();
			$("#paddleRight").show();
			$("#scoreLeft").show();
			$("#scoreRight").show();
			$("#middle").show();
			break;
		case -2: redrawBall();
	}
	return true;
}

function redrawBall(){
	var winner	= 0;

	$("#ball2").animate({top:getBallTRCorner()[0], right:getBallTRCorner()[1]},0);
	setBallTRCorner(ballTRCorner[0] + ballSpeedXY[1], ballTRCorner[1] + ballSpeedXY[0]);
	
	$("#ball").animate({top:getBallTRCorner()[0], right:getBallTRCorner()[1]},0);

	if(getBallTRCorner()[0] <= 0 || getBallTRCorner()[0] >= 870){
		setBallSpeedXY(getBallSpeedXY()[0], -getBallSpeedXY()[1]);
	}
	if(getBallTRCorner()[0] >= getLeftPaddleTop()-30 && getBallTRCorner()[0] <= getLeftPaddleTop()+150 && getBallTRCorner()[1]+30 >= 840 && getBallTRCorner()[1]+30 <= 846){
		setBallSpeedXY(-getBallSpeedXY()[0], Math.round(1/9*(ballTRCorner[0]-leftPaddleTop)-20/3));	
	}
	if(getBallTRCorner()[0] >= getRightPaddleTop()-30 && getBallTRCorner()[0] <= getRightPaddleTop()+150 && getBallTRCorner()[1] <= 60 && getBallTRCorner()[1] >= 54){
		setBallSpeedXY(-getBallSpeedXY()[0], Math.round(1/9*(ballTRCorner[0]-rightPaddleTop)-20/3));
	}
	if(getBallTRCorner()[1]<=30 && getBallTRCorner()[1]>=15){
		setScoreL(getScoreL() + 1);
		$("#scoreLeft").html(getScoreL());
		setBallSpeedXY(5,Math.round(Math.random()*7-Math.random()*7));
		setBallTRCorner(Math.round(Math.random()*900),435);
		$("#ball").animate({top:getBallTRCorner()[0], right:435},0);
		if(getScoreL() == 10){
			winner = 1;
		}	
	}
	if(getBallTRCorner()[1]>=870 && getBallTRCorner()[1]<=885){
		setScoreR(getScoreR() + 1);
		$("#scoreRight").html(getScoreR());
		setBallSpeedXY(-5,Math.round(Math.random()*7-Math.random()*7));
		setBallTRCorner(Math.round(Math.random()*900),435);
		$("#ball").animate({top:getBallTRCorner()[0], right:435},0);
		if(getScoreR() == 10){
			winner = 2;
		}
	}
	if(getNumOfPlayers() == 1){
		if(getBallTRCorner()[0]==getRightPaddleTop()+60 || (getBallTRCorner()[0]<getRightPaddleTop()+60 && getRightPaddleTop()<=0) || (getBallTRCorner()[0]>getRightPaddleTop()+60 && getRightPaddleTop()>=750)){
			setRightPaddleSpeed(0);
		}
		else if(getBallTRCorner()[0] > getRightPaddleTop()+60){
			setRightPaddleSpeed(2 + difficulty);
		}
		else if(getBallTRCorner()[0]<getRightPaddleTop()+60){
			setRightPaddleSpeed(-2- difficulty);
		}
		setRightPaddleTop(getRightPaddleTop()+getRightPaddleSpeed());
	}
	$("#paddleRight").animate({top: getRightPaddleTop()},0);
	if (winner == 0){
		window.setTimeout(function(){redrawBall();}, 5*(5-speed));
	}
	else{
		end(winner);
	}
	return true;
}

function isLegitButton(e){
	if(e.keyCode == 87 || e.keyCode == 38){
		if(getControl() == 1){
			setButtonPressed(true);
			updatePaddle(1);
		}
		else if(e.keyCode == 87 && !getButtonPlayer1()){
			setButtonPlayer1(true);
			updatePaddleMultiplayer(1);
		}
		else if(e.keyCode == 38 && !getButtonPlayer2()){
			setButtonPlayer2(true);
			updatePaddleMultiplayer(3);
		}

	}
	else if(e.keyCode == 83 || e.keyCode == 40){		
		if(getControl() == 1){
			setButtonPressed(true);
			updatePaddle(2);
		}
		else if(e.keyCode == 83 && !getButtonPlayer1()){
			setButtonPlayer1(true);
			updatePaddleMultiplayer(2);
		}
		else if(e.keyCode == 40 && !getButtonPlayer2()){
			setButtonPlayer2(true);
			updatePaddleMultiplayer(4);
		}
	}
}

function updatePaddleMultiplayer(x){
	if(x == 1 && getLeftPaddleTop() > 0){
		setLeftPaddleTop(getLeftPaddleTop() - 6);
		$("#paddleLeft").animate({top: getLeftPaddleTop()},0);
	}
	else if(x == 2 && getLeftPaddleTop() <750){
		setLeftPaddleTop(getLeftPaddleTop() + 6);
		$("#paddleLeft").animate({top: getLeftPaddleTop()},0);
	}
	else if(x == 3 && getRightPaddleTop() > 0){
		setRightPaddleTop(getRightPaddleTop() - 6);
		$("#paddleRight").animate({top: getRightPaddleTop()},0);
	}
	else if(x == 4 && getRightPaddleTop() <750){
		setRightPaddleTop(getRightPaddleTop() + 6);
		$("#paddleRight").animate({top: getRightPaddleTop()},0);
	}
	if((x == 1 || x == 2) && getButtonPlayer1() || (x == 3 || x == 4 )&& getButtonPlayer2()){
		window.setTimeout(function(){updatePaddleMultiplayer(x);}, 5*(5-speed));
	}
}

function updatePaddle(x){
	if(getControl() == 2 || getControl() == 0){
		var mouseY = x.pageY;
		if(mouseY>= 75&& mouseY<=825){
			$("#paddleLeft").animate({top: mouseY-75},0);
			setLeftPaddleTop(mouseY-75);
		}
		else if(mouseY<75){
			$("#paddleLeft").animate({top: 0},0);
			setLeftPaddleTop(0);
		}
		else if(mouseY>825){
			$("#paddleLeft").animate({top: 750},0);
			setLeftPaddleTop(750);
		}
		return true;
	}
	if(getControl() == 1){
		if(x == 1 && getLeftPaddleTop() > 0){
			setLeftPaddleTop(getLeftPaddleTop() - 6);
			$("#paddleLeft").animate({top: getLeftPaddleTop()},0);

		}
		else if(x == 2 && getLeftPaddleTop() <750){
			setLeftPaddleTop(getLeftPaddleTop() + 6);
			$("#paddleLeft").animate({top: getLeftPaddleTop()},0);
		}
		if(isButtonPressed()){
			window.setTimeout(function(){updatePaddle(x);}, 5*(5-speed));
		}
	}
}

function keyUp(e){
	if(e.keyCode == 87 || e.keyCode == 38){
		if(getControl() == 1){
			setButtonPressed(false);
		}
		else if(e.keyCode == 87){
			setButtonPlayer1(false);
		}
		else if(e.keyCode == 38){
			setButtonPlayer2(false);
		}

	}
	else if(e.keyCode == 83 || e.keyCode == 40){
		if(getControl() == 1){
			setButtonPressed(false);
		}
		else if(e.keyCode == 83){
			setButtonPlayer1(false);
		}
		else if(e.keyCode == 40){
			setButtonPlayer2(false);
		}
	}
}

function end(winner){
	switch(winner){
		case 2: $("#leftText").html("Lose :(");
			$("#rightText").html("Win :D");
			$("#leftText").show();
			$("#rightText").show();
			break;
		case 1: $("#leftText").html("Win :D");
			$("#rightText").html("Lose :(");
			$("#leftText").show();
			$("#rightText").show();
			break;
		default: break;
	}
	$(".ball").hide();
	$("#restart").show();
	$("#reset").show();

}

function reset(){
	initialSetting();
	$("#startDiv").show();
	$("#restart").hide();
	$("#reset").hide();
	$("#leftText").hide();
	$("#rightText").hide();
	$("#middle").hide();
	$("#paddleLeft").hide();
	$("#paddleRight").hide();
	$("#scoreLeft").hide();
	$("#scoreRight").hide();
	
}


// setters

function setDifficulty(x){
	window.difficulty = x;
}
function setSpeed(x){
	window.speed = x;
}
function setControl(x){
	window.control = x;
}
function setCounter(x){
	window.counter = x;
}
function setScoreL(x){
	window.scoreL = x;
}
function setScoreR(x){
	window.scoreR = x;
}
function setBallSpeedXY(x,y){
	window.ballSpeedXY[0] = x
	window.ballSpeedXY[1] = y
}
function setBallTRCorner(x,y){
	window.ballTRCorner[0] = x
	window.ballTRCorner[1] = y
}
function setLeftPaddleTop(x){
	window.leftPaddleTop = x;
}
function setRightPaddleTop(x){
	window.rightPaddleTop = x;
}
function setRightPaddleSpeed(x){
	window.rightPaddleSpeed = x;
}
function setButtonPressed(x){
	window.buttonPressed = x;
}
function setNumOfPlayers(x){
	window.numOfPlayers = x;
}
function setLocalOrNetwork(x){
	window.localOrNetwork = x;
}
function setButtonPlayer1(x){
	window.buttonPlayer1 = x;
}
function setButtonPlayer2(x){
	window.buttonPlayer2 = x;
}

//getters

function getDifficulty(){
	return window.difficulty;
}
function getSpeed(){
	return window.speed;
}
function getControl(){
	return window.control;
}
function getCounter(){
	return window.counter;
}
function getScoreL(){
	return window.scoreL;
}
function getScoreR(){
	return window.scoreR;
}
function getBallSpeedXY(){
	return window.ballSpeedXY;
}
function getBallTRCorner(){
	return window.ballTRCorner;
}
function getLeftPaddleTop(){
	return window.leftPaddleTop;
}
function getRightPaddleTop(){
	return window.rightPaddleTop;
}
function getRightPaddleSpeed(){
	return window.rightPaddleSpeed;
}
function isButtonPressed (){
	return window.buttonPressed;
}
function getNumOfPlayers(){
	return window.numOfPlayers;
}
function getLocalOrNetwork(){
	return window.localOrNetwork;
}
function getButtonPlayer1(){
	return window.buttonPlayer1;
}
function getButtonPlayer2(){
	return window.buttonPlayer2;
}
