//snake
#include <vector>
#include <iostream>
#include "tuple.h"
#include "snake.h"
using namespace std;
Snake::Snake()
{;}

Snake::Snake(int x, int y, Tuple direction, int ID)
{
	this->direction = direction;
	this->ID = ID;
	this->body = vector<Tuple>();
	this->body.push_back(Tuple(x,y));
	for(int i = 0; i < 11; i++)
	{
		this->body.push_back(Tuple(0, 0));
	}
	this->pointerHead = 0;
	this->pointerTail = 0;
	this->maxLength = 12;
	this->length = 3;
}

bool checkOppo(Tuple v1, Tuple v2)
{
	if(v1.getX() == 1 || v2.getX() == 1)
	{
		return v1.getX() == -1 || v2.getX() == -1;
	}
	else if(v1.getY() == 1 || v2.getY() == 1)
	{
		return v1.getY() == -1 || v2.getY() == -1;
	}
	else
	{
		return false;
	}
}

void Snake::changeDirection(Tuple v)
{
	if(!checkOppo(v, this->direction))
	{
		this->direction = v;
		//cout << __FUNCTION__ << "x: " << this->direction->getX()<< " y: "<<this->direction->getY() << endl;
	}
	
}

Tuple Snake::getDirection()
{
	return this->direction;
}

void Snake::move()
{
	Tuple head = this->body.at(0);
	for(int i = this->body.size()-1; i != 0; i--)
	{
		this->body.at(i).setX(this->body.at(i-1).getX());
		this->body.at(i).setY(this->body.at(i-1).getY());
	}
	this->body.at(0)=head.add(this->direction);//review
}

int Snake::getID()
{
	return this->ID;
}

void Snake::resetSnake(int x, int y, Tuple dir)
{
	//cout << __FUNCTION__ << "x: " << this->direction->getX()<< " y: "<<this->direction->getY() << endl;
	this->body.at(0) = Tuple(x,y);
	//this->changeDirection(dir);
	this->direction = dir;
	this->pointerHead = 0;
	this->pointerTail = 0;
	this->length = 3;
	//cout << __FUNCTION__ << "x: " << this->direction->getX() << " y: "<<this->direction->getY() << endl;
}

int Snake::getRealLength()
{
	return this->pointerHead - this->pointerTail + 1 + 
	(this->pointerTail > this->pointerHead ? this->maxLength : 0);
}

vector<Tuple> Snake::getBody()
{
	vector<Tuple> bod = vector<Tuple>();
	int len  = this->getRealLength();
	int i = this->pointerHead;
	for(int nb = 0; nb < len; nb++)
	{
		bod.push_back(this->body.at(i));
		i--;
		if(i<0)
		{
			i += this->maxLength;
		}
	}
	return bod;
}

void Snake::addBody(Tuple v)
{
	if(this->getRealLength() >= this->length)
	{
		this->pointerTail = (this->pointerTail+1)%this->maxLength;
	}
	this->pointerHead = (this->pointerHead+1)%this->maxLength;
	this->body.at(this->pointerHead) = v;
}

Tuple Snake::getHead()
{
	return this->body.at(this->pointerHead);
}

void Snake::eatBonus()
{
	if(this->length < this->maxLength)
	{
		this->length++;
	}
}