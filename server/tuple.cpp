//vector
#include "tuple.h"
Tuple::Tuple(int x , int y)
{
	this->x = x;
	this->y = y;
}

Tuple::Tuple()
{;}

int Tuple::getX()
{
	return this->x;
}

void Tuple::setX(int x)
{
	this->x = x;
}

int Tuple::getY()
{
	return this->y;
}

void Tuple::setY(int y)
{
	this->y = y;
}

Tuple Tuple::add(Tuple v)
{
	return Tuple(this->x + v.getX(), this->y + v.getY());
}

bool Tuple::operator==(Tuple v)
{
	return this->x == v.getX() && this->y == v.getY();
}