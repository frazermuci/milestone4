#ifndef VECTOR_H
#define VECTOR_H

class Tuple
{
	int x;
	int y;
	
	public:
		Tuple();
		Tuple(int x, int y);
		int getX();
		void setX(int x);
		int getY();
		void setY(int y);
		Tuple add(Tuple v);
		bool operator==(Tuple v);
};
#endif