//this is the snake.
//Flyweight this????? So that server can handle it????
function Snake(x, y, direction, ID)
{
	//maybe initialize with two or three and don't pass in
	this.ID = ID;
	//this.body = genBodyList(x, y, direction);
	this.direction = direction;//convertVectorToArray(direction);
	this.changeDirection = giveChangeDirection(this);
	this.getDirection = () => {
		return this.direction;
	}
	this.move = giveMove(this);
	this.getID = ()=>{return this.ID}
	this.resetSnake = (xPos,yPos,dir)=>{
		this.body[0] = new Vector(xPos,yPos);
		this.changeDirection(dir);
		this.pointerHead = 0;
		this.pointerTail = 0;
		this.length = 3;
	}
	
	this.body = [new Vector(x,y),new Vector(0,0),new Vector(0,0),new Vector(0,0),
				new Vector(0,0),new Vector(0,0),new Vector(0,0),new Vector(0,0),
				new Vector(0,0),new Vector(0,0),new Vector(0,0),new Vector(0,0)];
	this.pointerHead = 0;
	this.pointerTail = 0;
	this.maxLength = 12;
	this.length = 3;
	this.getRealLength = ()=>{
		return this.pointerHead - this.pointerTail + 1
		+ (this.pointerTail > this.pointerHead ? this.maxLength : 0);
	}
	this.getBody = () =>{
		var bod = [];
		var len = this.getRealLength();
		var i = this.pointerHead;
		for(var nb = 0; nb < len; nb++) {
			bod.push(this.body[i]);
			i--;
			if(i<0)
				i += this.maxLength;
		}
		return bod;
	}
	this.addBody = (vector) => {
		if(this.getRealLength() >= this.length)
		{
			this.pointerTail = (this.pointerTail+1)%this.maxLength;
		}
		this.pointerHead = (this.pointerHead+1)%this.maxLength;
		this.body[this.pointerHead] = vector;
	}
	
	this.getHead = ()=>{
		return this.body[this.pointerHead];
	}
	
	this.eatBonus = ()=>{
		if(this.length < this.maxLength)
			this.length++;
	}
};

//initializes bodyList
function genBodyList(x, y, direction)//start at some coords and do not hard code
{
	direction = convertVectorToArray(direction);
	var body = [];
	var cdirection = [0,0];
	var dx = x;
	var dy = y;
	for(var i = 0; i< 1; i++)
	{
		//body = body.concat([new Body(dx, dy)]);
		//body = body.concat([new Vector(dx, dy)]);
		//maybe come back to this and refactor to use v2
		//xy = giveCoord(dx,dy,direction, [(x,y)=>{return x-y},(x,y)=>{return x+y}]);
		//xy = giveV2(body[i], direction);
		//dx = xy[0];
		//dy = xy[1];
		body = body.concat([giveV2(dx,dy,cdirection)])
		dx = body[i].getX();
		dy = body[i].getY();
		cdirection = [-1*direction[0], -1*direction[1]];
	}
	//body[2].isLast = 1;
	return body;
}

//generates function addBody which adds body to bodyList
function giveAddBody(snake)//add in oppo direction of last body.
							//edge case what happens when
							//growth happens and hits a solid object
							//it would be use alt and make turning point
							//other edge case: if snake grows into head of other snake
							//does it case other snake to lose?
{
	//probs don't wanna pass in body, probs just construct new body huh.
	var func = function(objList)//obj list of everythin on map
	{
		lastBody = snake.body[snake.body.length-1];
		//lastBody.isLast = 0;
		x = lastBody.x;
		y = lastBody.y;
		//var xy = changeXYAddBody(x,y,snake.direction);

		//maybe refactor to use v2
		var xy = addHelper(x, y, snake.direction, objList);
		//body = new Body(xy[0], xy[1]);
		body = new Vector(xy[0], xy[1]);
		//body.isLast = 1;
		snake.body = snake.body.concat([body]);
	}
	return func;
}

//generates function move which progresses all bodies
//in bodyList
function giveMove(snake)
{
	var func = function()
	{
		var head = snake.body[0];
		//maybe refactor to use v2
		//var xy = giveCoord(head.x, head.y, snake.direction,
		//				   [(x,y)=>{return x+y}, (x,y)=>{return x-y}]);
		//var xy //giveV2(snake.direction);
		for(var i = snake.body.length-1; i != 0; i--)
		{
			snake.body[i].x = snake.body[i-1].x;
			snake.body[i].y = snake.body[i-1].y;
		}
		head.add(snake.direction);
	}
	return func;
}


//check for whether or not change happens in oppo direction
function giveChangeDirection(snake)
{
	var func = function(v)
	{
		var xy = convertVectorToArray(v);

		var snakedir = convertVectorToArray(snake.direction);

		var dir  = translateDirection([xy[0], xy[1]]);
		var sdir = translateDirection([snakedir[0], snakedir[1]]);
		if(!checkOppo(dir, sdir))
		{
			snake.direction = v;
		}
	}
	return func;
}

// get head
// is tile in body (vector)
