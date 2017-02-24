function testSnakeInitID()
{
	var s = new Snake(4,4,[1,0], 1);
	var s2 = new Snake(4,5,[1,0], 2);
	console.assert(s.getID() == 1,"ID wrong", s.getID());
	console.assert(s2.getID() == 2, "ID wrong", s2.getID());
}
testSnakeInitID();

function testInitSnake()
{
	var s = new Snake(4,4,[1,0]);
	for(var k = 0; k < 3 ; k++)
	{
		console.assert(s.body[k].x == 4 - k && s.body[k].y == 4,
		"initialization incorrect: xy", 
		s.body[k]);
	}
}
testInitSnake();

function testSnakeAddBody()
{
	var s = new Snake(4,4,[1,0]);
	s.addBody([new Vector(-500,-300)]);
	console.assert(s.body[3].x == 1 && s.body[3].y == 4);
}
testSnakeAddBody();

function testSnakeAddBodyToAltCoord()
{
	var s = new Snake(4,4,[1,0]);
	s.addBody([new Vector(1,4)]);
	console.assert(s.body[3].x == 2 && s.body[3].y == 3,s.body);
}
testSnakeAddBodyToAltCoord();

function testSnakeAddBodyToAltCoordII()
{
	var s = new Snake(4,4,[1,0]);
	s.addBody([new Vector(1,4), new Vector(2,3)]);
	console.assert(s.body[3].x == 2 && s.body[3].y == 5,s.body);
}
testSnakeAddBodyToAltCoordII();

function testSnakeMove()
{
	var s = new Snake(4,4,[1,0]);
	for(var i = 0; i < 50 ; i++)
	{
		s.move();
	}
	for(var j = 0; j < 3 ; j++)
	{
		console.assert(s.body[j].x == 4-j+50 && s.body[j].y == 4,
		"body part not moved correctly",
		s.body[j]);
	}
	s = new Snake(4,4,[-1,0]);
	for(var i = 0; i < 50 ; i++)
	{
		s.move();
	}
	for(var j = 0; j < 3 ; j++)
	{
		console.assert(s.body[j].x == 4+j-50 && s.body[j].y == 4,
		"body part not moved correctly",
		s.body[j]);
	}
	s = new Snake(4,4,[0,-1]);
	for(var i = 0; i < 50 ; i++)
	{
		s.move();
	}
	for(var j = 0; j < 3 ; j++)
	{
		console.assert(s.body[j].x == 4 && s.body[j].y == 4+j-50,
		"body part not moved correctly",
		s.body[j]);
	}
	s = new Snake(4,4,[0,1]);
	for(var i = 0; i < 50 ; i++)
	{
		s.move();
	}
	for(var j = 0; j < 3 ; j++)
	{
		console.assert(s.body[j].x == 4 && s.body[j].y == 4-j+50,
		"body part not moved correctly",
		s.body[j]);
	}
}

testSnakeMove();

function testChangeDirectionSnake()
{
	var s = new Snake(4,4,[1,0]);
	s.move();
	s.move();
	s.changeDirection([0,-1]);
	s.changeDirection([0,1]);
	s.changeDirection([0,-1]);
	s.move();
	s.move();
	s.move();
	s.changeDirection([-1,0]);
	s.changeDirection([1, 0]);
	s.move();
	s.changeDirection([0,1]);
	s.changeDirection([0, -1]);
	s.move();
	
	console.assert(s.body[0].x == 5 && s.body[0].y == 2,
				   "body not changedDirection correctly",s.body[0]);
	console.assert(s.body[1].x == 5 && s.body[1].y == 1,
				   "body not changedDirection correctly",s.body[1]);
	console.assert(s.body[2].x == 6 && s.body[1].y == 1,
				   "body not changeDirection correctly");
	
}

testChangeDirectionSnake();