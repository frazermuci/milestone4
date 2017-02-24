//var clientAddress = "127.0.0.1";
//var clientPort = "21234";
var clientAddress;
var clientPort;
var calculatedLatency = 0;
var first = 0;

function Socket(model){
	first = Math.floor( Date.now() / 1000 );
	this.model = model;
	this.connection = new WebSocket('ws://'+clientAddress+':'+clientPort);//, ['soap', 'xmpp']);
	

	this.convertBinToInt = function(input)
	{
		var a = 0;//s[0];
		var count = 128;
		for(var i = 0; i < input.length; ++i)
		{
			if(input[i] == "1")
			{
				a = a + count;
			}
			count = count/2;
		}
		return a;
	}
	
	this.deserialize = function(bin)
	{
    
		s= [0,0,0,0]
		for(var h =0 ; h < bin.length; ++h)
		{
			s[h] = this.convertBinToInt(bin[h]);
		}
		a= s[0];
		var s1Dir = new Vector(1,0);
		var s1Bonus = false;
		var s1Loss = false;
		var s2Dir= new Vector(1,0);
		var s2Bonus=false;
		var s2Loss=false;
		var s1BonusX = 0;
		var s1BonusY = 0;
		var s2BonusX = 0;
		var s2BonusY = 0;
    
		// s1Dir s1Dir s1Bonus s1Loss s2Dir s2Dir s2Bonus s2Loss
		if(a > 127)
		{
			a -= 128;
			if(a > 63) // Up
			{
				a-=64;
				s1Dir = new Vector(0,-1);
			}
			else // Down
				s1Dir = new Vector(0, 1);
		}
		else
		{
			if(a > 63) // Right
			{
				a-=64;			
				s1Dir = new Vector(1,0);
			}
			else // Left
				s1Dir = new Vector(-1, 0);
		}
    
		if(a > 31)
		{
			a-= 32;
			s1Loss = true;
		}
    
		if(a > 15)
		{
			a-= 16;
			s1Bonus = true;
		}
    
		if(a > 7)
		{
			a -= 8;
			if(a > 3) // Up
			{
				a-=4;
				s2Dir = new Vector(0,-1);
			}
			else // Down
				s2Dir = new Vector(0, 1);
		}
		else
		{
			if(a > 3) // Right
			{
				a-=4;
				s2Dir = new Vector(1,0);
			}
			else // Left
				s2Dir = new Vector(-1, 0);
		}
    
		if(a > 1)
		{
			a-= 2;
			s2Loss = true;
		}
    
		if(a > 0)
		{
			a-= 1;
			s2Bonus = true;
		}
    
		var i = 1;
    
		if(s1Bonus)
		{
			var b = s[i];
			s1BonusY = b%16;
			s1BonusX = (b-s1BonusY)/16;
			i++;
		}
		if(s2Bonus)
		{
			var c = s[i];
			s2BonusY = c%16;
			s2BonusX = (c-s2BonusY)/16;
			i++;
		}
    
		// SET TO MODEL
		if(getModel().snakeIndex == 1)
		{
			getModel().changeDirection(0, s1Dir);
		}
		else
		{
			console.log(getModel().snakeIndex)
			getModel().changeDirection(1, s2Dir);
		}
		
		getModel().growSnake(0);
		getModel().growSnake(1);
		if(s1Bonus)
		{
			getModel().getSnake(0).eatBonus();
			getModel.score[0] +=100
			var bonusToChange = 1;
			var newBonusPos = new Vector(s1BonusX, s1BonusY);
			var snake1Head = getModel().getSnake(0).getHead();
        
			if(snake1Head.equals(getModel().bonuses[0]))
				bonusToChange = 0;
        
			getModel().bonuses[bonusToChange] = newBonusPos;
		}
		if(s2Bonus)
		{
			getModel().getSnake(1).eatBonus();
			getModel().score[1] +=100
			var bonusToChange = 1;
			var newBonusPos = new Vector(s2BonusX, s2BonusY);
			var snake1Head = getModel().getSnake(1).getHead();
        
			if(snake1Head.equals(getModel().bonuses[0]))
				bonusToChange = 0;
        
			getModel().bonuses[bonusToChange] = newBonusPos;
		}
		//document.getElementById("toptitle").innerHTML = getModel().ids[0]+"Score: "+getModel().score[0] + " - "+ getModel().ids[1] + "Score: " + getModel().score[0]
		if(s1Loss && s2Loss)
		{
			ControllerTie();
		}
		else if(s1Loss)
			ControllerWin(2);
		else if(s2Loss)
			ControllerWin(1);
		}
	
		this.serialize = function(model)
		{
		
		var snake = getModel().getSnake(model.snakeIndex); // TODO NEEDS TO KNOW WHAT SNAKE
		var dir = snake.direction;
    
		if(dir.equals(new Vector(1,0))) // Right
			return 64+16+4+1; // 01 01 01 01
		if(dir.equals(new Vector(0,-1))) // Up
			return 128+64+32+16+8+4+2+1; // 11 11 11 11
		if(dir.equals(new Vector(-1,0))) // Left
			return 0; // 00 00 00 00
		if(dir.equals(new Vector(0,1))) // Down
			return 128+32+8+2; // 01 01 01 01
	}

// Log errors
	//this.scoreArray = [0,0];
	//this.count = 1;
	this.connection.onerror = function (error) {
		console.log('WebSocket Error ' + error);
	};
	
	this.sendMessage = function(inc)
	{
		first = Math.floor( Date.now() / 1000 );
		this.connection.send(inc);
	}
// Log messages from the server
	this.connection.onmessage = (e)=> {
		//this is in scope?
		var array = e.data.split(":");
		//console.log(array)
		console.log((Math.floor( Date.now() / 1000 ))-first);
		//console.log(parseInt(array[3]));
		//console.log(array[3]);
		calculatedLatency = (Math.floor( Date.now() / 1000 )-first);//-parseInt(array[3]);
		document.getElementById("latency").innerHTML = calculatedLatency == null ? 0 : calculatedLatency;

		if (array[0] == "init")
		{
			this.sendMessage("init:" + model.snakeID);
		}
		else if(array[0] == "start")
		{
			//ID
			getModel().snakeIndex = parseInt(array[2]);
			var temp = getModel().snakeIndex == 1 ? 0 : 1;
			getModel().ids[temp] = parseInt(array[1]);
			getModel().ids[getModel().snakeIndex] = getModel().snakeID;
			window.setTimeout(ControllerTick, 750);
		}
		else 
		{
			this.deserialize(array);
			//ViewRefresh();
			window.setTimeout(ControllerTick, 750);
			//ViewRefresh();
		}
		
		this.count =0;
		ViewRefresh();
	}
	this.done = ()=>{this.connection.send("DONE")}
};