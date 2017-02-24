a couple things to note:
-use g++ to compile code
-TO START THE SERVER, GIVE IT 127.0.0.1 as an IP
-the server modifies the chatroom example
-the scores are stored in a the ClientScore map 
-the ids are stored in the ClientScore map
-server sends / receives on port 21234
-client listens on port 21234
-websocket.cpp will not compile on windows machine and thus
server could not be ran natively on windows
-client sockets are not able to connect to server on uci mobile
access
-please contact us about our implementation, we were only able
to test using a loopback address 

Christian Ejercito 67074186
serialization initialization


Matthew Frazer 70509018
server implementation
main
manageconnection
model.cpp/h
snake
tuple
all serverside modifications and game logic
basically everything implemented in C++
integration and bug fixes
protocol definition and implementation (client/server side)


Panagiotis Tsiapkolis 24247656
serialization
game logic
network state update