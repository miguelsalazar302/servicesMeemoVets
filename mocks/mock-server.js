var http    =  require('http');
var mockserver  =  require('mockserver');

http.createServer(mockserver('./')).listen(9001);