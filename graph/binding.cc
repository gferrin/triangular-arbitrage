#define BUILDING_NODE_EXTENSION
#include "directed_graph.h"

using namespace v8;

void Graph::Init(Handle<Object> target) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(New); // this calls the New member function
  tpl->SetClassName(String::NewSymbol("Graph"));
  tpl->InstanceTemplate()->SetInternalFieldCount(1);
  // Prototype
  
  tpl->PrototypeTemplate()->Set(String::NewSymbol("add_node"),
      FunctionTemplate::New(add_node)->GetFunction());
  
  tpl->PrototypeTemplate()->Set(String::NewSymbol("add_edge"),
  	  FunctionTemplate::New(add_edge)->GetFunction());

  tpl->PrototypeTemplate()->Set(String::NewSymbol("update_edge"),
      FunctionTemplate::New(update_edge)->GetFunction());

  tpl->PrototypeTemplate()->Set(String::NewSymbol("print"),
      FunctionTemplate::New(print)->GetFunction());

  tpl->PrototypeTemplate()->Set(String::NewSymbol("trim"),
      FunctionTemplate::New(trim)->GetFunction());

  tpl->PrototypeTemplate()->Set(String::NewSymbol("check_arbitrage"),
      FunctionTemplate::New(check_arbitrage)->GetFunction());

  Persistent<Function> constructor = Persistent<Function>::New(tpl->GetFunction());
  target->Set(String::NewSymbol("Graph"), constructor);
}
// this is the "New member function"
Handle<Value> Graph::New(const Arguments& args) {
  HandleScope scope;

  Graph* obj = new Graph();
  obj->Wrap(args.This());
  return args.This();
}

Handle<Value> Graph::add_node(const v8::Arguments& args)
{
  HandleScope scope;

  if (args.Length() != 1 ) {
    ThrowException(Exception::TypeError(String::New("Wrong number of arguments")));
    return scope.Close(Undefined());
  }

  Graph* graph = ObjectWrap::Unwrap<Graph>(args.This());

  v8::String::Utf8Value param(args[0]->ToString());
  std::string currency = std::string(*param);  

  graph->add_node( currency );
  return scope.Close(Boolean::New(true));
}

Handle<Value> Graph::add_edge(const v8::Arguments& args)
{
  HandleScope scope;

  Graph* graph = ObjectWrap::Unwrap<Graph>(args.This());

  if( args.Length() == 3 ){
    v8::String::Utf8Value param1(args[0]->ToString());
    v8::String::Utf8Value param2(args[1]->ToString());

    std::string from = std::string(*param1);
    std::string to = std::string(*param2);
    double weight = args[2]->NumberValue();

    graph->add_edge( from, to, weight );
    return scope.Close(Boolean::New(true));

  } else if( args.Length() == 5 ){

    v8::String::Utf8Value param1(args[0]->ToString());
    v8::String::Utf8Value param2(args[1]->ToString());
    v8::String::Utf8Value paramType(args[2]->ToString());

    std::string from = std::string(*param1);
    std::string to = std::string(*param2);
    std::string type = std::string(*paramType);
    double exchange_rate = args[3]->NumberValue();
    double fee = args[4]->NumberValue();

    graph->add_currency_edge( from, to, type, exchange_rate, fee );
    return scope.Close(Boolean::New(true));

  } else {
    ThrowException(Exception::TypeError(String::New("Wrong number of arguments")));
    return scope.Close(Undefined()); 
  }
}

Handle<Value> Graph::update_edge(const v8::Arguments& args)
{
  HandleScope scope;

  Graph* graph = ObjectWrap::Unwrap<Graph>(args.This());
  if( args.Length() == 3 ){
    v8::String::Utf8Value param1(args[0]->ToString());
    v8::String::Utf8Value param2(args[1]->ToString());

    std::string from = std::string(*param1);
    std::string to = std::string(*param2);
    double weight = args[2]->NumberValue();

    graph->update_edge( from, to, weight );
    return scope.Close(Boolean::New(true));

  } else if( args.Length() == 5 ){

    v8::String::Utf8Value param1(args[0]->ToString());
    v8::String::Utf8Value param2(args[1]->ToString());
    v8::String::Utf8Value paramType(args[2]->ToString());

    std::string from = std::string(*param1);
    std::string to = std::string(*param2);
    std::string type = std::string(*paramType);
    double exchange_rate = args[3]->NumberValue();
    double fee = args[4]->NumberValue();

    graph->update_currency_edge( from, to, type, exchange_rate, fee );
    return scope.Close(Boolean::New(true));

  } else {
    ThrowException(Exception::TypeError(String::New("Wrong number of arguments")));
    return scope.Close(Undefined()); 
  }
}

Handle<Value> Graph::print(const v8::Arguments& args)
{
  HandleScope scope;

  Graph* graph = ObjectWrap::Unwrap<Graph>(args.This());
  graph->print();

  return scope.Close(Boolean::New(true));
}

Handle<Value> Graph::trim(const v8::Arguments& args)
{
  HandleScope scope;

  Graph* graph = ObjectWrap::Unwrap<Graph>(args.This());
  graph->trim();

  return scope.Close(Boolean::New(true));
}

Handle<Value> Graph::check_arbitrage(const v8::Arguments& args)
{
  HandleScope scope;
  std::vector<std::string> path;

  if( args.Length() != 1 ) {
    std::cout << "in != l \n";
    ThrowException(Exception::TypeError(String::New("Wrong number of arguments")));
    return scope.Close(Undefined()); 
  }
  Graph* graph = ObjectWrap::Unwrap<Graph>(args.This());
  v8::String::Utf8Value param1(args[0]->ToString());
  std::string source = std::string(*param1);

  graph->bellman_ford( source, path );

  Handle<Array> result = Array::New( path.size() );
  
  for( int i = 0; i < path.size(); ++i ){
    // this is some stupid hack because for some reason it was putting the 
    // elements in the array in the wrong order
    result->Set( path.size() - i - 1, String::New( path.at(i).c_str() ));
    //std::cout << "path.at(i): " << path.at(i) << std::endl;
    //result->Set(i, String::New( path.at(i).c_str()));
  }

  return scope.Close( result );
  
}















