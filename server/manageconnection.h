#ifndef MANAGECONNECTION_H
#define MANAGECONNECTION_H

#include <string>
#include <vector>
#include <map>
#include "websocket.h"
#include  "tuple.h"
#include "model.h"

//using namespace std;

typedef struct Compressed
{
	int s1Direction;
	bool s1BonusEaten;
	bool s1Loss;
	int s1BonusPositionX;
	int s1BonusPositionY;
	int s2Direction;
	bool s2BonusEaten;
	bool s2Loss;
	int s2BonusPositionX;
	int s2BonusPositionY;
} Compressed;

class ConnectionManager
{
	webSocket* server;
	Model model;
	//maps clientID to snakeID
	map<int,int> IDs;						
	//state, checks if both clients have sent in their state before progressing
	map<int, bool> state;
	//maps clientID with snakeNumber/ConnectionNumber (i.e. 0 or 1)
	map<int, int> clientIDWithConnNum;
	map<int,map<int, bool> > sequenceMap;
	bool gameOn;
	Compressed c;
	
	void handleS1(int ID, Compressed c);
	void handleS2(int ID, Compressed c);
	
	public: 
		ConnectionManager(webSocket *server, int width, int height);
		bool isGameOn();
		void connNumWithClientID(int clientID, int connNum);
		int getConnNum(int clientID);
		bool connReady();		
		void printIDs();
		void printPos();
		void addConn(int ID, int snakeID);		
		void removeConn(int ID);		
		void sendState();		
		void send(int clientID, string message);		
		void sendAll(string message);		
		void sendIDs();			
		void updateModel(int clientID, int newDir);		
		void addSnake(int clientID, int x, int y, Tuple direction);		
		void removeSnake(int clientID);	
		bool stateReady(int clientID, int seqNum);		
		void moveModel(Compressed* c);
		void newGame();
		//Compressed compressModel();
		unsigned char* serialize(Compressed* c);
		int deserialize(int s);
};

#endif
