//enum that defines directions
var direction = {UP:1, DOWN:2, LEFT:3, RIGHT:4};

function convertVectorToArray(vector)
{
	if(vector.constructor === Array)
	{
		return vector;
	}
	return [vector.getX(), vector.getY()];
}

function giveV2(x, y, direction)
{
	var dx = x + direction[0];
	var dy = y + direction [1];
	return new Vector(dx,dy);
}

function checkOppo(circle, dir)
{
	if(circle == 4 || dir == 4)
	{
		return circle == 3 || dir == 3;
	}
	else if(circle == 1 || dir == 1)
	{
		return circle == 2 || dir == 2;
	}
	else
	{
		return false;
	}
}

function translateDirection(dir)
{
	if(dir[0] == 1)
	{
		return 4;
	}
	else if(dir[0] == -1)
	{
		return 3;
	}
	else if(dir[1] == 1)
	{
		return 1;
	}
	else if(dir[1] == -1)
	{
		return 2;
	}
}
function addHelper(x, y, dir, objList) //will add in reference to direction of head
{
	var circle = translateDirection(dir)-1;
	var check = true;
	while(check)// this means we cant have a situation where three things suround a square
	{
		circle = circle % 4 + 1;//also can't move in direction
		var xy = giveCoord(x, y, circle, [(x,y)=>{return x-y},(x,y)=>{return x+y}]);
		for(var i =0; i < objList.length; i++)
		{
			var body = objList[i];
			check = (xy[0] == body.x && xy[1] == body.y || checkOppo(circle,dir));
			if(check)
			{
				break;
			}
		}
		
	}
	return xy;
}

function giveCoord(x, y, dir, funcList)
{
	var dx = x;
	var	dy = y;
	switch(dir)
	{
		case 1://direction.UP:
		{
			dy = funcList[0](y,1);
			break;
		}
		case 2://direction.DOWN:
		{
			dy = funcList[1](y,1);
			break;
		}
		case 3://direction.LEFT:
		{
			dx = funcList[1](x,1);
			break;
		}
		case 4://direction.RIGHT:
		{	
			dx = funcList[0](x,1);
			break;
		}
	}
	return [dx,dy];
}