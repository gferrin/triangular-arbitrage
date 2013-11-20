/*
	Author: Gabriel Ferrin
	Date: May 7th 2013
*/

#include "directed_graph.h"
#include <cmath>

using namespace std;

Graph::Graph() : source( NULL ) {}

Graph::Graph( string & name )
{
	source = new GNode( name, nodes.size() );
	nodes.push_back( *source );
}

Graph::~Graph() 
{
	for( int i = 0; i < nodes.size(); ++i ){
		nodes.at(i).edges.clear();
	}
	nodes.clear();
}

void Graph::add_node( string & currency )
{
	if( !search(currency) ){
		GNode *temp = new GNode( currency, nodes.size() );
		nodes.push_back( *temp );	
	}
}

void Graph::add_edge( std::string & begin, std::string & end, double weight )
{
	if( search(begin) ){
		GNode *origin = get_node( begin );
		GNode *dest; 
		
		if( search(end) ){
			dest = get_node( end );
			add_edge( origin, dest, weight ); 
		} else {
			cout << "Error: no node \"" << end << "\" exists \n";
		}
	} else {
		cout << "Error: no node \"" << begin << "\" exists \n";
	}
}

void Graph::update_edge( std::string & begin, std::string & end, double weight )
{
	if( search(begin) ){
		GNode *origin = get_node( begin );
		GNode *dest; 
		
		if( search(end) ){
			dest = get_node( end );
			for( int i = 0; i < origin->edges.size(); ++i ){
				if( origin->edges.at(i).node->currency_type == dest->currency_type ){
					origin->edges.at(i).weight = weight;
				}
			}
		} else {
			cout << "Error: no node \"" << end << "\" exists \n";
		}
	} else {
		cout << "Error: no node \"" << begin << "\" exists \n";
	}	
}

void Graph::add_currency_edge( std::string & begin, std::string & end, std::string & type, double exchange_rate, double fee  )
{
	double weight;

	if( type == "ask" ){
		weight = log( exchange_rate + (exchange_rate * fee) ); 
	} else if( type == "bid" ){
		weight = log( 1 / ( exchange_rate + (exchange_rate * fee) )); 
	} else{
		cout << "Error: wrong type for add currency edge - " << type << endl;
		return;
	}
	add_edge( begin, end, weight );
}

void Graph::update_currency_edge( std::string & begin, std::string & end, std::string & type, double exchange_rate, double fee )
{
	double weight;

	if( type == "ask" ){
		weight = log( exchange_rate + (exchange_rate * fee) ); 
	} else if( type == "bid" ){
		weight = log( 1 / ( exchange_rate + (exchange_rate * fee) )); 
	} else{
		cout << "Error: wrong type for update currency edge - " << type << endl;
		return;
	}
	update_edge( begin, end, weight );
}

void Graph::print()
{
	for( int i = 0; i < nodes.size(); ++i ){
		cout << nodes.at(i).currency_type << ": \n";

		for( int j = 0; j < nodes.at(i).edges.size(); ++j ){
			cout << "\t" <<  "weight: "<< nodes.at(i).edges.at(j).weight
			     << " to: " <<nodes.at(i).edges.at(j).node->currency_type << "\n";
		}
	}
}

void Graph::trim()
{
	// remove all bad edges from nodes
	for( int i = 0; i < nodes.size(); ++i ){ // this needs to be done probably fewer times, try and prove this
		for( int k = 0; k < nodes.size(); ++k ){
			for( int x = 0; x < nodes.at(k).edges.size(); ++x ){
				if( nodes.at(k).edges.at(x).node->edges.size() < 2 ){
					nodes.at(k).edges.erase( nodes.at(k).edges.begin() + x );
				}
			}
		}	
	}
	

	// remove all nodes with only one edge
	for( int i = 0; i < nodes.size(); ++i){
		if( nodes.at(i).edges.size() < 2 ){
			nodes.erase( nodes.begin() + i );
			if( i < 2 ){
				i = 0;
			} else {
				i -= 2;
			}
		}
	}

	// reset all of the key values
	for( int j = 0; j < nodes.size(); ++j){
		nodes.at(j).key = j;
	}

}

bool Graph::search( std::string & name )
{	
	for( int i = 0; i < nodes.size(); ++i ){
		if( name == nodes.at(i).currency_type ){
			return true;
		}
	}
	return false;
}

std::string Graph::bellman_ford( std::string & name, std::vector<std::string>& path )
{
	for( int i = 0; i < nodes.size(); ++i ){
		if( name == nodes.at(i).currency_type ){
			GNode *temp = get_node( name );
			return bellman_ford( temp, path );
		}
	}
}

void Graph::add_edge( GNode *& origin, GNode *& destination, double weight )
{
	GEdge *temp = new GEdge( weight, destination );
	origin->edges.push_back( *temp );
}

string Graph::bellman_ford( GNode *& origin, std::vector<std::string>& path )
{
	vector<double> distances, parents;
	const double infinity = 99999999;

	// Initilize
	for( int i = 0; i < nodes.size(); ++i ){
		if( nodes.at(i).currency_type == origin->currency_type ){
			distances.push_back( 0 );
		} else {
			distances.push_back( infinity );
		}

		parents.push_back( NULL );
	}

	// Relaxe Edges
	for( int v = 0; v < nodes.size() - 1; ++v ){ // do the main loop v - 1 times, or v times to find negative weights
		bool changed = false;

		for( int l = 0; l < nodes.size(); ++l ){ // these two loops - for every edge in the graph 
			for( int m = 0; m < nodes.at(l).edges.size(); ++m ){
				GEdge * temp = &nodes.at( l ).edges.at( m );
				GNode * tempNode = &nodes.at( l );
				// If distances[u] + w < distances[v]
				if( distances.at( tempNode->key ) + temp->weight < distances.at( temp->node->key ) && distances.at( tempNode->key ) != infinity ){
					changed = true;
					distances.at( temp->node->key ) = temp->weight + distances.at( tempNode->key );
					parents.at( temp->node->key ) =  tempNode->key;
				}
			}
		}
		if( !changed ){
			break;
		} else {
			changed = false;
		}
	}

	string message = "Graph contains NO negative weight cycles \n"; 
	// Check for negative weight cycles
	for( int l = 0; l < nodes.size(); ++l ){ // these two loops - for every edge in the graph 
		for( int m = 0; m < nodes.at(l).edges.size(); ++m ){
			GEdge * temp = &nodes.at( l ).edges.at( m );
			GNode * tempNode = &nodes.at( l );
			// If distances[u] + w < distances[v]
			if( distances.at( tempNode->key ) + temp->weight < distances.at( temp->node->key ) && distances.at( tempNode->key ) != infinity ){
				message = "Graph contains negative weight cycles \n"; 
				bool null_check = true;

				path.push_back( nodes.at( tempNode->key ).currency_type );
				tempNode = &nodes.at( parents.at( tempNode->key ));
					
				if( tempNode == NULL ){
					null_check = false;
				} 
				path.push_back( tempNode->currency_type );
					
				if( &nodes.at( parents.at( tempNode->key )) == NULL ){
					null_check = false;	
				}
				path.push_back( nodes.at( parents.at( tempNode->key )).currency_type );

				if( path.at(0) == path.at(1) || path.at(0) == path.at(2) || path.at(1) == path.at(2)){
					false;				
				}

				if( null_check ){
					cout << message;
					return message; 
				} else {
					path.clear();
				}
			}
		}
	}
	
	cout << message;
	return message; 
}





