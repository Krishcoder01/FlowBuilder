import { useEffect, useState} from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// import CustomNodeF from './CustomNodeF';
import InputNode from './Nodes/InputNode';
import RadioNode from './Nodes/RadioNode';
import OptionNode from './Nodes/OptionNode';
import { CiSearch } from 'react-icons/ci';
import { FaArrowRight } from 'react-icons/fa';
import { BsInputCursor } from 'react-icons/bs';
import { IoMdRadioButtonOn } from 'react-icons/io';
import { IoOptionsSharp } from 'react-icons/io5';





const FlowReactFinal = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [parentId, setParentId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null); 

  const rootNode = nodes.find(n => n.data?.parentId === null);

  const nodeTypes = {
    customInput: (props) => (
      <InputNode {...props} onAdd={handleAdd} onSelect={handleSelect}  updateNodeData={updateNodeData} />
    ),
    customRadio: (props) => (
      <RadioNode {...props} onAdd={handleAdd} onSelect={handleSelect} updateNodeData={updateNodeData}  />
    ),
    customOption: (props) => (
      <OptionNode {...props} onAdd={handleAdd} onSelect={handleSelect} updateNodeData={updateNodeData} />
    ),
  };

  function handleAdd(id) {
    setParentId(id);
    setShowPopup(true);
  }

  function handleSelect(id) {
    console.log('Selected node:', id);
  }

const updateNodeData = (id, patch) => {
  setNodes((nds) =>
    nds.map((node) =>
      node.id === id
        ? { ...node, data: { ...node.data, ...patch } }
        : node
    )
  );
};


  //Local Storage fetching
  useEffect(() => {
    const storedNodes = localStorage.getItem('nodes');
    const storedEdges = localStorage.getItem('edges');
    console.log('Loaded from localStorage:', storedNodes, storedEdges);
    if (storedNodes) setNodes(JSON.parse(storedNodes));
    if (storedEdges) setEdges(JSON.parse(storedEdges));    
  }, []);

  //Local Storage saving
  useEffect(() => {
    localStorage.setItem('nodes', JSON.stringify(nodes));
    localStorage.setItem('edges', JSON.stringify(edges));
  }
, [nodes, edges]);


  // Cycle detection
  const wouldCreateCycle = (nodes, parentId, childId) => {
    let current = parentId;
    while (current) {
      if (current === childId) return true;
      const parentNode = nodes.find(n => n.id === current);
      current = parentNode?.data.parentId ?? null;
    }
    return false;
  };


  // Add node
  const addNode = (type) => {
    if (!parentId && rootNode) {
      console.warn('Root node already exists');
      return;
    }

    const id = Date.now().toString();
    const parent = nodes.find(n => n.id === parentId);

    if (parentId === id || (parentId && wouldCreateCycle(nodes, parentId, id))) {
      console.warn('Invalid parent — cycle/self-link detected');
      return;
    }

    const newNode = {
      id,
      type,
      position: parent
        ? { x: parent.position.x + 350, y: parent.position.y }
        : { x: window.innerWidth / 2 - 75, y: window.innerHeight / 2 - 40 },
      data: {
        parentId: parentId ?? null,
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

  // OnConnect
  const OnConnect = ({ source, target }) => {

    if( !source || !target ) {
      console.warn('Source or target is missing');
      return;
    }

    if (source === target || wouldCreateCycle(nodes, source, target)) {
      console.warn('Invalid connection — cycle/self-link detected');
      return;
    }

    setNodes(nds => {
      const targetNode = nds.find(n => n.id === target);
      if (targetNode) {
        targetNode.data = {
          ...targetNode.data,
          parentId: source,
        };
      }
      return [...nds];
    });

    setEdges(eds => {
      const removalEdge = eds.filter((e)=> e.target !== target);
      return [
      ...removalEdge,
      {
        id: `e-${source}-${target}`,
        source,
        target,
      },
    ]
    });
  }

  const lineup = [
    { id: '1', type: 'customInput', title : "Input Type Node" ,  position: { x: 0, y: 0 }, data: { parentId: null } , icon : <BsInputCursor className='text-white' />},
    { id: '2', type: 'customRadio', title: "Radio Type Node", position: { x: 200, y: 0 }, data: { parentId: '1', options: ['X', 'Y', 'Z'], selected: 'Y' } , icon : <IoMdRadioButtonOn className='text-white' />},
    { id: '3', type: 'customOption', title: "Option Type Node", position: { x: 400, y: 0 }, data: { parentId: '2', options: ['Opt1', 'Opt2'] } , icon : <IoOptionsSharp className='text-white' />},
  ]



  return (
    <div className="w-screen h-screen bg-[#252527] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={OnConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {!rootNode && !showPopup && (
        <button
          onClick={() => setShowPopup(true)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-[#2D2D2F] border-2 outline-double border-[#757579] rounded-full shadow-xl z-10"
        >
          <div className='flex justify-center items-center gap-6'>
            <div>
            <img src="/bard-line.svg" alt="Add" className="w-12 h-12 mb-2" />
          </div>
          <div className='flex flex-col text-left'>
            <h1 className='font-bold text-3xl text-[#bebebe]'>Create your first step</h1>
            <h2 className='text-[#a9a7a7]'>Add a trigger or action to get started</h2>
          </div>
          </div>
        </button>
      )}
      {showPopup && <div onClick={() => setShowPopup(false)} className='absolute  inset-0 flex bg-black/65  items-center justify-center'>
        <div  className='parent p-2 rounded-xl bg-[#252527] w-[40vw]'>
          <div className=' phelper  flex flex-col gap-4'>
            <div className='child01 bg-[#2d2d2f] min-h-[5vh] rounded-xl flex items-center  gap-2'>
              <div>
                <CiSearch className='text-white text-xl ml-3' />
              </div>
              <div>
                <input type="text" placeholder='Search .... ' className='p-2 rounded border-none text-white outline-none w-full' />
              </div>
            </div>
            <div className='child02 bg-[#2d2d2f] min-h-[12vh] rounded-xl flex  flex-col items-center '>
              {lineup.map((item)=>(
                <div key={item.id} className='flex  gap-2 p-2 items-center w-full '>
                <div onClick={()=>addNode(item.type)} className='flex w-full gap-2 rounded-2xl hover:bg-[#252527] p-2'>
                  <div className='flex items-center justify-center p-3 border-[1px] rounded-xl border-[#6b6b6b]'>
                  {item.icon}
                </div>
                <div className='flex  items-center justify-between w-full'>
                  <h2 className='text-white font-light'>{item.title}</h2>
                  <div><FaArrowRight className='text-white' /></div>
                </div>
                  </div>
              </div>
              ))}
            </div>
          </div>
        </div>
        </div>}


    </div>
  );
};

export default FlowReactFinal;
