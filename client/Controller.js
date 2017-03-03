var controllerInterval;
var socket;
var controllerGameEnded = false;

function ControllerNewGame()
{
	controllerGameEnded = false;
	console.log("ControllerNewGame");
    getModel().newGame();
    getModel().isRunning = 1;
	ViewRefresh();
	socket = new Socket(getModel());
}

function ControllerStopGame()
{
	controllerGameEnded = true;
	console.log("ControllerStopGame");
    getModel().isRunning = 0;
	ViewRefresh();
	socket.done();
}

function ControllerTie()
{

	console.log("TIE");
	getModel().lastWinner = 0;
	ControllerStopGame();
}

function ControllerWin(id)
{
	console.log("WIN " + id);
	getModel().lastWinner = id+1;
	ControllerStopGame();
}

function ControllerTick()
{
	if(controllerGameEnded)
	{
		return;
	}
	console.log("ControllerTick.Tick");
	socket.sendMessage(socket.serialize(getModel()));
	ViewRefresh();
	return;	
}

/*function ControllerChangeDirection(id, vector)
{
    var m = getModel();
    m.changeDirection(id, vector);
}*/
function ControllerChangeDirection(vector)
{
    var m = getModel();
    m.changeDirection(m.snakeIndex, vector);
		console.log("direction changed");
}

function ControllerMainLoop()
{
    if (getModel().isRunning == 1)
    {
		console.log("Ticking");
        ControllerTick();
    }
}

//controllerInterval = window.setInterval(ControllerMainLoop, 750);
//ControllerNewGame();
