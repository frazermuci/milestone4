#include "model.h"
#include <iostream>
#include <math.h>
#include <time.h>
#include <stdlib.h>  

using namespace std;
Model::Model()
{;}

Model::Model(int boardWidth, int boardHeight)
{
	srand(time(NULL));
	this->snakes = map<int, Snake*>();	
	this->bonuses = vector<Tuple>();
	//this->score = vector<int>();
	this->scores = map<int, int>();
	this->boardWidth  = boardWidth;
	this->boardHeight = boardHeight;
	this->bonuses.push_back(Tuple(6,5));
	this->bonuses.push_back(Tuple(5,6));
	
		
	this->snakes[0] =  new Snake(2,2,Tuple(1,0),0);
	this->snakes[1] =  new Snake(4,4,Tuple(1,0),1);
	//this->score.push_back(0);
	//this->score.push_back(0);
	//setting snakes requires the server to 
	//decide which client gets put at which place
	this->isRunning = false;
}

Model::~Model()
{
	/*map<int, Snake*>::iterator it;
	for (it = this->snakes.begin(); it != this->snakes.end(); it++)
	{
		delete it->second;
	}*/
	;
}

void Model::setScore(int ID, int score)
{
	this->scores[ID] = score;
}

/*vector<int> Model::getIDs()
{
	return this->IDs;
}*/

/*void Model::setIDs(vector<int> IDs)
{
	this->IDs = IDs;
}*/

void Model::addSnake(int ID, Snake* snake)
{
	this->snakes[ID] = snake;
}

void Model::removeSnake(int ID)
{
	map<int, Snake*> sMap = map<int, Snake*>();
	map<int, Snake*>::iterator it;
    for (it = this->snakes.begin(); it != this->snakes.end(); it++)
	{
		if(ID != it->first)
		{
			sMap[it->first] = it->second;
		}
		else
		{
			delete this->snakes[it->first];
		}
	}
	this->snakes = sMap;
}

vector<Snake*> Model::getSnakes()
{
	vector<Snake*> sVect = vector<Snake*>();
	map<int, Snake*>::iterator it;
    for (it = this->snakes.begin(); it != this->snakes.end(); it++)
	{
		sVect.push_back(it->second);
	}
	return sVect;
}

Snake* Model::getSnake(int ID)
{
	return this->snakes[ID];
}

int Model::getNumberSnakes()
{
	return this->snakes.size();
}

void Model::growSnake(int ID)
{
	Snake* s = this->getSnake(ID);
	Tuple v = s->getHead().add(s->getDirection());
	s->addBody(v);
}

void Model::changeDirection(int ID, Tuple dir)
{
	//cout << "snake: " << ID << "xDir: " << dir.getX() << " yDir: " << dir.getY() << endl;
	//Snake s = *this->getSnake(ID);
	//s.changeDirection(dir); 
	this->getSnake(ID)->changeDirection(dir);
}

vector<Tuple> Model::getBonuses()
{
	//return this->bonuses;
	vector<Tuple> retList = vector<Tuple>();
	retList.push_back(this->bonuses.at(0));
	retList.push_back(this->bonuses.at(1));
	return retList;
}

bool objectInTheWay(Model m, int x, int y)
{
	vector<Snake*> sVect =  m.getSnakes();
	for(int i = 0; i < sVect.size(); ++i)
	{
		vector<Tuple> body = sVect.at(i)->getBody();
		for(int j = 0; j < body.size(); ++j)
		{
			if(body.at(j) == Tuple(x, y))
			{
				return true;
			}
		}
	}
	
	vector<Tuple> bVect = m.getBonuses();
	for(int i = 0; i < bVect.size(); ++i)
	{
		if(bVect.at(i) == Tuple(x,y))
		{
			return true;
		}
	}
	return false;
}
	
Tuple Model::makeBonus(int bpos)
{
	int x = static_cast<int>(floor(rand() *  this->boardWidth)) % this->boardWidth;
	int y = static_cast<int>(floor(rand() * this->boardHeight)) % this->boardHeight;
	
	if(x < 0)
	{
		x = x*-1;
	}
	if(y < 0)
	{
		y = y*-1;
	}
	while(objectInTheWay(*this,x,y))
	{
		x = static_cast<int>(floor(rand() *  this->boardWidth)) % this->boardWidth;
		y = static_cast<int>(floor(rand() * this->boardHeight)) % this->boardHeight;
		if(x < 0)
		{
			x = x*-1;
		}
		if(y < 0)
		{
			y = y*-1;
		}
	}
	//cout << "x: "<< x << "   y: " << y << endl;
	this->bonuses.at(bpos) = Tuple(x,y);
}

int Model::getBoardWidth()
{
	return this->boardWidth;
}

int Model::getBoardHeight()
{
	return this->boardHeight;
}

void Model::setIsRunning(bool isRunning)
{
	this->isRunning = isRunning;
}
		
bool Model::getIsRunning()
{
	return this->isRunning;
}
	
void Model::move()
{
	map<int, Snake*>::iterator it;
	for(it = this->snakes.begin(); it!=this->snakes.end();++it)
	{
		this->growSnake(it->first);
		//it->second.move();
	}
}

void Model::newGame()
{
		//cout << __FUNCTION__ << "x: " << this->getSnake(1)->getDirection().getX() << " y: "<<this->getSnake(1)->getDirection().getY() << endl;
		this->getSnake(0)->resetSnake(2,2,Tuple(1,0));
		this->getSnake(1)->resetSnake(9,7, Tuple(-1,0));
		
		this->bonuses.at(0) = Tuple(7,2);
		this->bonuses.at(1) = Tuple(4,7);
		//cout << __FUNCTION__ << "x: " << this->getSnake(1)->getDirection().getX() << " y: "<<this->getSnake(1)->getDirection().getY() << endl;
}