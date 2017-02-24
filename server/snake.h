#ifndef SNAKE_H
#define SNAKE_H
#include <vector>
#include "tuple.h"
using namespace std;

class Snake
{
	int ID;
	Tuple direction;
	vector<Tuple> body;
	int pointerHead;
	int pointerTail;
	int maxLength;
	int length;
	
	public:
		Snake();
		Snake(int x, int y, Tuple direction, int ID);
		void changeDirection(Tuple v);
		Tuple getDirection();
		void move();
		int getID();
		void resetSnake(int x, int y, Tuple dir);
		int getRealLength();
		vector<Tuple> getBody();
		void addBody(Tuple v);
		Tuple getHead();
		void eatBonus();
};
#endif