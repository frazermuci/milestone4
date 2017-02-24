#ifndef MODEL_H
#define MODEL_H
#include <vector>
#include <map>
#include <math.h>
#include <time.h>
#include "snake.h"

using namespace std;


class Model
{
	//snake num to snakes
	map<int, Snake*> snakes;
	//keeps track of bonuses
	vector<Tuple> bonuses;
	//this->snakes //	 	 = [new Snake(2,2,new Tuple(0,1), 0),//must decide who gets which place
				//				new Snake(4,4,new Tuple(0,1), 0)];
	//Map SnakeID with score of Snakes			
	map<int, int> scores;
	int boardWidth;
	int boardHeight;
	bool isRunning;
	
	public:
		Model();
		Model(int boardWidth, int boardHeight);
		~Model();
		void setScore(int ID, int score);		
		vector<int> getIDs();
		//void setIDs(vector<int> IDs);
		void addSnake(int ID, Snake* snake);
		void removeSnake(int ID);
		vector<Snake*> getSnakes();		
		Snake* getSnake(int ID);
		int getNumberSnakes();
		void growSnake(int ID);
		void changeDirection(int ID, Tuple dir);
		vector<Tuple> getBonuses();
		Tuple makeBonus(int bpos);
		int getBoardWidth();
		int getBoardHeight();
		void setIsRunning(bool isRunning);
		bool getIsRunning();
		void move();
		void newGame();
}; 

#endif