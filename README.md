This is a program which takes advantage of triangular arbitrage opertunities
on the BTC-E bitcoin exchange 

to get started do

`> npm install`

and then build the binarys 

`> node-gyp configure build`

and run with 

`> node triangle.js` 

be sure to be using v0.8.5 of node or it likely wont work

## Description

This program makes use of the bellman-ford algorithm to find negative weight cycles
in a weigted graph where each currency is a node in the graph and each edge weight is 
the invese of the transaction cost.