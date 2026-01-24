import { Handle, Position } from '@xyflow/react';

const CustomNode = ({ data }) => {
  return (
    <div className="w-[150px] h-[80px] bg-white border-2 border-blue-500 rounded-lg shadow relative">
      <div className="h-full flex items-center px-4 text-blue-900 font-medium">
        {data.label}
      </div>

      <button
        onClick={data.onAdd}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <img src="/add-circle-fill.svg" width={16} height={16} />
      </button>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomNode;
