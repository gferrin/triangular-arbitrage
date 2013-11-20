#define BUILDING_NODE_EXTENSION
#include <node.h>
#include "directed_graph.h"

using namespace v8;

void InitAll(Handle<Object> exports) {
  Graph::Init(exports);
}

NODE_MODULE(graph, InitAll)