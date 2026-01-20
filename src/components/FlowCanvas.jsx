import React, { useState, useRef, useEffect} from 'react';

const NW = 150;
const NH = 80;
const Btn_R = 13;

const FlowCanvas = () => {


  const canvasRef = useRef(null);
  const plusIconRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [parentId, setParentId] = useState(null);
  const [drag, setdrag] = useState(null)
  const [pos, setpos] = useState({x:0,y:0});


  useEffect(() => {
  const img = new Image();
  img.src = '/add-circle-fill.svg'; 
  
  img.onload = () => {
    plusIconRef.current = img;
    setNodes(prev => [...prev]); 
  };
}, []);


// Sizing which will run once
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d'); // I got the power to paint


    //Size
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;

  }, []);


// Node and Edges case
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

        const icon = plusIconRef.current;
        const iconSize = 16;

    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Edges
    edges.forEach(({ sourceId, targetId }) => {
      const s = nodes.find(n => n.id === sourceId);
      const t = nodes.find(n => n.id === targetId);

      if (!s || !t) return; // not printing for those which is parent

      ctx.beginPath();
      ctx.moveTo(s.x + NW / 2, s.y + NH / 2); 
      ctx.lineTo(t.x + NW / 2, t.y + NH / 2);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    nodes.forEach(node => {

      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#5d97f5';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, node.x, node.y, NW, NH, 10);

      ctx.fillStyle = '#0a3b80';
      ctx.font = '14px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x + 20, node.y + NH / 2);

           const bx = node.x + NW - 20;
      const by = node.y + NH / 2;
  

if (icon) {
  ctx.drawImage(
    icon, 
    bx - iconSize / 2,
    by - iconSize / 2, 
    iconSize, 
    iconSize
  );
}

 

    //   ctx.fillStyle = '#3b82f6';
    //   ctx.beginPath();
    //   ctx.arc(bx, by, Btn_R, 0, Math.PI * 2);
    //   ctx.fill();

    //   ctx.fillStyle = 'white';
    //   ctx.textAlign = 'center';
    //   ctx.fillText('+', bx, by + 1);
    //   ctx.textAlign = 'left';


    });
  }, [nodes, edges]);

  const handleMouseDown = e => {
    const x = e.clientX;
    const y = e.clientY;

    for (const node of nodes) {
      if (
        x >= node.x &&
        x <= node.x + NW &&
        y >= node.y &&
        y <= node.y + NH
      ) {
        setdrag(node.id);
        setpos({ x: x - node.x, y: y - node.y });
        return;
      }
    }
  };

    const handleMouseMove = e => {
    if (!drag) return;

    const x = e.clientX;
    const y = e.clientY;

    setNodes(prev =>
      prev.map(node =>
        node.id === drag
          ? { ...node, x: x - pos.x, y: y - pos.y }
          : node
      )
    );
  };

  const handleMouseUp = () => {
    setdrag(null);
  };

  const handleCanvasClick = e => {

    // const rect = canvasRef.current.getBoundingClientRect();
    // const x = e.clientX - rect.left;
    const x = e.clientX ;
    // const y = e.clientY - rect.top;
    const y = e.clientY;

    for (const node of nodes) {
      const bx = node.x + NW - 20;
      const by = node.y + NH / 2;
      const d = Math.hypot(x - bx, y - by);

      if (d < Btn_R) {
        setParentId(node.id);
        setShowPopup(true);
        return;
      }
    
    }
  };

  const addNode = label => {
    setNodes(prev => {
      const parent = prev.find(n => n.id === parentId);
      const id = Date.now();

      const newNode = {
        id,
        label,
        x: parent ? parent.x + 200 : window.innerWidth / 2 - NW / 2,
        y: parent ? parent.y : window.innerHeight / 2 - NH / 2
      };

      if (parentId) {
        setEdges(e => [...e, { sourceId: parentId, targetId: id }]);
      }

      return [...prev, newNode];
    });

    setShowPopup(false);
  };

  return (
    <div className="relative w-screen h-screen bg-slate-50 overflow-hidden">

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        className="block cursor-crosshair"
      />

      {nodes.length === 0 && !showPopup && (
        <button
          onClick={() => setShowPopup(true)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-blue-600 text-white rounded-full shadow-xl"
        >
          Click me to get list
        </button>
      )}

      {showPopup && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl">
            <h3 className="mb-4 font-bold">Select Sample</h3>
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => addNode(`Sample ${n}`)}
                className="block w-full text-left p-2 hover:bg-blue-50"
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


function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export default FlowCanvas;
