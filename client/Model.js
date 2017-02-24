var modelSingleton;
var modelSingletonInstance = false;
//ASSUMING EXCLUSIVE BOUNDS WHILE ITS 0 - (BOUND - 1)

function Model(boardWidth,boardHeight, snakeID)
{
	this.snakeID		 = snakeID;// idea it gets ID from server and associates that snake
								   // with local model
	this.snakeIndex		 = 0;
	this.bonuses 	 	 = [new Vector(6,5), new Vector(5,6)];
	this.snakes 	 	 = [new Snake(2,2,new Vector(0,1), 0),
								new Snake(4,4,new Vector(0,1), 0)];
	this.score			 = [0,0];
	this.ids			 = [0,1];
	this.boardWidth  	 = boardWidth;
	this.boardHeight 	 = boardHeight;
	this.isRunning   	 = 0;
	
	this.setScore		 = (score)=>{this.score = score};
	this.getIds			 =  ()=>{return this.ids};
	this.setIds			 =  (ids)=>{this.ids = ids};
	this.addSnake 		 = genAddSnake(this);
	this.getNumberSnakes = ()=>{return this.snakes.length};
	this.getSnake		 = genGetSnake(this);
	this.getSnakes		 = ()=>{return this.snakes};
	this.growSnake		 = genGrowSnake(this);

	this.changeDirection = genGetChangeDirection(this);//this does not bound check

	this.getBonuses  	 = ()=>{return this.bonuses};
	this.makeBonus 		 = genMakeBonus(this);

	this.getBoardWidth   = ()=>{return this.boardWidth};
	this.getBoardHeight  = ()=>{return this.boardHeight};
	

	this.newGame = ()=>{
		//snakes = [new Snake(2,2, new Vector(0,1), 0), new Snake(4,4, new Vector(0,1), 1)];
		//snakes[0] = new Snake(2,2, new Vector(0,1), 0);
		//snakes[1] = new Snake(4,4, new Vector(0,1), 1);
		this.getSnake(0).resetSnake(2,2,new Vector(1,0));
		this.getSnake(1).resetSnake(9,7,new Vector(-1,0));
		this.bonuses[0] = new Vector(7,2);
		this.bonuses[1] = new Vector(4,7);
		this.score[0] = 0;
		this.score[1] = 0;
	}
	this.lastWinner = -1;

	this.getClock
	this.incClock
	//this.getModel 	     = ()=>{return this};
	this.getIsRunning    = ()=>{return this.isRunning};
};

function getModel()
{
	if(!modelSingletonInstance) {
		modelSingleton = new Model(12, 9, 0);
		modelSingletonInstance = true;
	}
	return modelSingleton;
}

function genAddSnake(model) // snake adder
{
	function func(snake)
	{
		this.snakes = this.snakes.concat([snake]);
	}
	return func;
}

function genGetSnake(model) // finds snake that is associated with model
{
	function func(ID)
	{
		return model.snakes[ID];
	}
	return func;
}

function genGrowSnake(model) // adds new body part
{
	function func(ID)
	{
		var s = model.getSnake(ID);
		var nP = s.getHead().add(s.getDirection());
		s.addBody(nP);
		console.log("ID: "+ID + " x: "+nP.x)
		console.log("ID: "+ID + " y: "+nP.y)
	}
	return func;
}

function genGetChangeDirection(model) //changes direction of snake associated with model
{
	function func(ID,direction)
	{
		snake = model.getSnake(ID);
		
		snake.changeDirection(direction);
	
	}
	return func;
}

//generates makeBonus ///////////perhaps we can have a wrapper that checks if bonuses is
							   //under thresh and then call so that every tick you can call
							   //this no issue
function genMakeBonus(model)
{
	//helper function
	//checks an x y to see if there already is object there
	function objectInTheWay(x,y)
	{
		var snakes = model.getSnakes();
		for(var i = 0; i < snakes.length; i++)
		{
			var body = snakes[i].getBody();
			for(var j = 0; j < body.length; j++)
			{
				if(body[j].equals(new Vector(x,y)))
					return true;
			}
		}
		
		var bonuses = model.getBonuses();
		for(var i = 0; i < bonuses.length; i++)
		{
			if(bonuses[i].equals(new Vector(x,y)))
				return true;
		}
		return false;
	}
	//generated function
	// keeps generating random x and y in bounds
	//until there is no object in the way and returns that x y
	function func(bid)
	{
		x = Math.floor(Math.random() * model.boardWidth);
		y = Math.floor(Math.random() * model.boardHeight);
		while(objectInTheWay(x,y))
		{
			x = Math.floor(Math.random() * model.boardWidth);
			y = Math.floor(Math.random() * model.boardHeight);
		}
		model.bonuses[bid] = new Vector(x,y);
		//model.bonuses = model.bonuses.concat([[x,y]]);
	}
	return func;

	/* //wrapper
	function wrapper()
	{
		if (model.bonuses.length < model.bonusNumber)
		{
			func();
		}
	}

	return wrapper;*/
}

getModel();
