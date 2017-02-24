function Vector(x, y)
{
	this.x    = x;
	this.y 	  = y;
	this.getX = genGetX(this);
	this.setX = genSetX(this);
	this.getY = genGetY(this);
	this.setY = genSetY(this);
	this.add  = genAdd(this);
	this.equals = genEquals(this);
};

function genGetX(vector)
{
	function func()
	{
		return vector.x;
	}
	return func;
}
function genSetX(vector)
{
	function func(x)
	{
		vector.x = x;
	}
	return func;
}
function genGetY(vector)
{
	function func()
	{
		return vector.y;
	}
	return func;
}
function genSetY(vector)
{
	function func(y)
	{
		vector.y = y;
	}
	return func;
}
function genAdd(vector)
{
	function func(v2)
	{
		//console.log("aaa");
		return new Vector(vector.x + v2.x, vector.y + v2.y)
		//vector.x = vector.x + v2[0];
		//vector.y = vector.y + v2[1];
	}
	return func;
}
function genEquals(vector)
{
	function func(v2)
	{
		return (vector.x == v2.x && vector.y == v2.y);
	}
	return func;
}
var vectorLeft = new Vector(-1,0);