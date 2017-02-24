function testModelInit()
{
	var model = new Model(8, 16, 1);
	console.assert(model.getBoardWidth() == 8 && model.getBoardHeight() == 16,
					"width, heighth problem", model);
	console.assert(model.snakeID == 1, "snake ID", model);
	console.assert(!model.getIsRunning(), "is running", model);
	console.assert(model.getSnakes().length == 0, "length of snakes",model);
}
testModelInit();

function testGetSnake()
{
	var model = new Model(8, 16, 1);
	model.addSnake(new Snake(7, 4, [1,0], 1));
	model.addSnake(new Snake(7, 14, [1,0], 2));
	console.assert(model.getSnake(2).getID() == 2 , "get snake doesn't work: 2", model);
	console.assert(model.getSnake(1).getID() == 1 , "get snake doesn't work: 1", model);
}
testGetSnake();

function testModelGrowSnake()
{
	var model = new Model(8, 16, 1);
	model.addSnake(new Snake(7, 4, [1,0], 1));
	model.growSnake(1);
	console.assert(model.getSnake(1).getBody().length == 4,
					"didn't grow snake", model);
}
testModelGrowSnake();

function testModelChangeDirection()
{
	var model = new Model(8, 16, 1);	
	model.addSnake(new Snake(7, 4, [1,0], 1));
	model.changeDirection([-1, 0]);
	console.assert(model.getSnake(1).direction[0] == 1 && model.getSnake(1).direction[1] == 0,
					"change directions when it shouldn't",model)
	model.changeDirection([0, -1]);
	console.assert(model.getSnake(1).direction[0] == 0 && model.getSnake(1).direction[1] == -1,
					"didn't change directions correctly",model)	
}
testModelChangeDirection();

function testMakeBonus()
{
	var model = new Model(8, 16, 1);
	model.makeBonus();
	console.assert(model.getBonuses().length == 1, "bonus not added", model);
	var check = convertVectorToArray(model.getBonuses()[0]);
	console.assert(check[0] <= 8 && check[0] >= 0 && check[1] <= 16 && check[1] >= 0,
					"Bonus not added in bounds", model);
}
testMakeBonus();
