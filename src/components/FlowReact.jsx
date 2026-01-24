import { useState } from 'react';
import  {
    ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const FlowReact = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [parentId, setParentId] = useState(null);

  const addNode = label => {
    const id = Date.now().toString();
    const parent = nodes.find(n => n.id === parentId);

    const newNode = {
      id,
      type: 'custom',
      position: parent
        ? { x: parent.position.x + 200, y: parent.position.y }
        : { x: window.innerWidth / 2 - 75, y: window.innerHeight / 2 - 40 },
      data: {
        label,
        onAdd: () => {
          setParentId(id);
          setShowPopup(true);
        },
      },
    };

    setNodes(nds => [...nds, newNode]);

    if (parentId) {
      setEdges(eds => [
        ...eds,
        {
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
        },
      ]);
    }

    setShowPopup(false);
    setParentId(null);
  };

  return (
    <div className="w-screen h-screen bg-slate-50 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {nodes.length === 0 && !showPopup && (
        <button
          onClick={() => setShowPopup(true)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-blue-600 text-white rounded-full shadow-xl z-10"
        >
          Click me to get list
        </button>
      )}

      {showPopup && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-64">
            <h3 className="mb-4 font-bold">Select Sample</h3>
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => addNode(`Sample ${n}`)}
                className="block w-full text-left p-2 rounded hover:bg-blue-50"
              >
                Sample {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowReact;
