import { Handle, Position } from '@xyflow/react';
import { IoIosAddCircle } from 'react-icons/io';

const BaseNode = ({ id, data, onAdd, onSelect , children }) => {
  return (
    <div className="min-w-[16vw] min-h-[6vh] border-double border-4 border-[#525253] bg-[#252527] rounded-3xl  p-2 shadow relative">
    
      <div className="text-sm min-h-[8vh] text-white overflow-hidden">
        {children}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdd(id);
        }}
        className="nodrag absolute right-2 top-2 flex items-center justify-center p-1 text-xl"
      >
        <IoIosAddCircle className="text-white" />
      </button>

      {/* <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        className="nodrag absolute left-2 bottom-2 text-xs text-green-500"
      >
        Select
      </button> */}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default BaseNode;
