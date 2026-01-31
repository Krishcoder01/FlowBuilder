import { Handle, Position } from '@xyflow/react';

const CustomNodeF = ({ id, data, onAdd, onSelect }) => {
  return (
    <div className="w-[150px] h-[80px] bg-white border-2 border-blue-500 rounded-lg shadow relative">

      <div className="h-full flex items-center px-4 text-blue-900 font-medium">
        {data.label}
      </div>

      {/* Add child */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdd(id);
        }}
        className="nodrag absolute right-2 top-2"
      >
        <img src="/add-circle-fill.svg" width={16} height={16} />
      </button>

      {/* Select node */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        className="nodrag absolute left-2 bottom-2 text-xs text-green-500"
      >
        Select
      </button>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomNodeF;
