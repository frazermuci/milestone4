#include <stdlib.h>
#include <iostream>
#include <string>
#include <queue>
#include <sstream>
#include <cstring>
#include <time.h>
#include "manageconnection.h"
#include "websocket.h"

using namespace std;

struct QueueQuintuple
{
	string message;
	int delay;
	int clientID;
	int timestamp;
	int seqNum;
	bool operator() (QueueQuintuple& qp1,QueueQuintuple& qp2)
    {
        //return qp1.delay > qp2.delay;
		return qp1.seqNum > qp2.seqNum;
    }
};

//struct for serialization

webSocket server;
ConnectionManager cm = ConnectionManager(&server, 12, 9);//server is not initialized..well see.
//ConnectionManager cm = ConnectionManager(&server, 9, 12);
priority_queue <QueueQuintuple, vector<QueueQuintuple>, QueueQuintuple> messageQueue;
//maps clientID with sequence count;
map<int,int> clientIDSequenceCount = map<int,int>();
int count = 0;
time_t  timev;
//time(&timev);

/* called when a client connects */
void openHandler(int clientID)
{
	time(&timev);
	time_t temp = timev;
	ostringstream os;
	//bool isZero = count == 0;
	//os << "init"<<":"<<isZero?"2:2":"4:4";
	
	cm.connNumWithClientID(clientID, count);
	
	clientIDSequenceCount[clientID] = 0;
	time(&timev);
	os << "init:" << count << ":" <<(timev-temp);
	cm.send(clientID, os.str());
	/*int x,y = 4;
	if(isZero)
	{
		x = 2;
		y = 2;
	}
	cm.addSnake(clientID, x, y, Tuple(0,1));*/
	count = count == 0 ? 1 : 0;
}

/* called when a client disconnects */
void closeHandler(int clientID)
{   
	cm.removeConn(clientID);
	cm.removeSnake(clientID);
	count = cm.getConnNum(clientID) == 1 ? 1 : 0;
}

vector<string> parseMessage(string message)
{
	vector<string> mVect = vector<string>();
	ostringstream in;
	string::iterator it;
	for(it = message.begin(); it != message.end(); ++it)
	{
		if((*it) != ':')
		{
			in << (*it);
		}
		else
		{
			mVect.push_back(in.str());
			in.str("");
		}
	}
	mVect.push_back(in.str());
	return mVect;
}

bool isInitMessage(string str)
{
	return strcmp(str.c_str(), "init") == 0;
}

void initializeConnection(int clientID, vector<string> mVect)
{
	cm.addConn(clientID, atoi(mVect.at(1).c_str()));
	if(cm.connReady())
	{
		cm.newGame();
		cm.sendIDs();//on client side, wait until "begin"
	}
}

string handleBinaryConversion(int i)
{
	ostringstream os;
	int posVal = 128;
	//big endian string repr of bits
	while(posVal >= 1)
	{
		if(i >= posVal)
		{
			os << "1";
			i = i-posVal;
		}
		else
		{
			os << "0";
		}
		posVal /=2;
	}
	return os.str();
}
void decrementDelays()
{
	vector<QueueQuintuple> temp = vector<QueueQuintuple>();
	while(messageQueue.size() != 0)
	{
		QueueQuintuple qp = messageQueue.top();
		qp.delay--;
		temp.push_back(qp);
		messageQueue.pop();
	}
	for(vector<QueueQuintuple>::iterator it = temp.begin(); it!= temp.end(); ++it)
	{
		messageQueue.push(*it);
	}
}

/* called when a client sends a message to the server */
void messageHandler(int clientID, string message)
{
	if(cm.isGameOn())
	{
		time(&timev);
		time_t tempTime = timev;
		//cout << message << endl;
		vector<string> mVect = parseMessage(message);
		if(isInitMessage(mVect.at(0)))
		{
			//parse message and get id
			//cout << "clientID: " << clientID << " otherID: " << mVect.at(1) << endl;
			initializeConnection(clientID, mVect);
			return;
		}
		cm.updateModel(clientID, cm.deserialize(atoi(message.c_str())));
		QueueQuintuple qp = QueueQuintuple();
		qp.message = message;		
		qp.clientID = clientID;
		qp.timestamp = tempTime;
		qp.delay = (static_cast<int>(floor(rand() *  3))+1) % 3;
		//cout << __FUNCTION__ << " delay: " << qp.delay << endl;
		if(qp.delay < 0)
		{
			qp.delay*=-1;
		}
		messageQueue.push(qp);
		clientIDSequenceCount[clientID] = clientIDSequenceCount[clientID]+1;
	}
}

void inPeriodic()
{
		//serializing new state
	ostringstream os;		
	QueueQuintuple qp;
	vector<QueueQuintuple> rejectList = vector<QueueQuintuple>();
	decrementDelays();
	while(messageQueue.size()!=0 && (qp = messageQueue.top()).delay <= 0)
	{
		messageQueue.pop();
		
		if(cm.stateReady(qp.clientID, qp.seqNum))
		{
			//cout << __FUNCTION__ << endl;
			Compressed* c = static_cast<Compressed*>(malloc(sizeof(struct Compressed)));
			cm.moveModel(c);
			string st = handleBinaryConversion(cm.serialize(c)[0]);
			string bonusPos1 = handleBinaryConversion(cm.serialize(c)[1]);
			string bonusPos2 = handleBinaryConversion(cm.serialize(c)[2]);
			time(&timev);
			os << st << ":" << bonusPos1 << ":" << bonusPos2 << ":" << timev-qp.timestamp;
			//cout << " time stamp: " << timev-qp.timestamp << endl;
			//cout << os.str() << endl;
			cm.sendAll(os.str().c_str());
			os.str("");
			free(c);
		}
		else
		{
			rejectList.push_back(qp);
		}
	}
	for(vector<QueueQuintuple>::iterator it = rejectList.begin(); it != rejectList.end(); ++it)
	{
		messageQueue.push(*it);
	}
			
		
}

/* called orrnce per select() loop */
void periodicHandler(){
	if(cm.connReady())
	{
		static time_t next = time(NULL) + 2;
		time_t current = time(NULL);
		if (current >= next){
		
			inPeriodic();
			next = time(NULL) + 2;
		}
	}
}

int main(int argc, char *argv[]){
    int port  = 21234;

    //cout << "Please set server port: ";
    //cin >> port;

    /* set event handler */
    server.setOpenHandler(openHandler);
    server.setCloseHandler(closeHandler);
    server.setMessageHandler(messageHandler);
    server.setPeriodicHandler(periodicHandler);

    /* start the chatroom server, listen to ip '127.0.0.1' and port '8000' */
    server.startServer(port);

    return 1;
}
