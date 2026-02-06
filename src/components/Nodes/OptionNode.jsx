import BaseNode from "./BaseNode";

const OptionNode = ({ id, data, updateNodeData, ...rest }) => {
  const options = data.options || ["Option 1", "Option 2"];

  return (
    <BaseNode id={id} data={data} {...rest}>
      <div className="font-bold text-lg mb-3">Option Node</div>

      <select
        className="w-full  border-none bg-[#2d2d2f] p-1 py-2 rounded-xl text-lg focus:ring-0 focus:outline-none text-white" 
        value={data.selected || ""}
        onChange={(e) =>
          updateNodeData(id, { selected: e.target.value })
        }
        
      >
        <option value="">Select Options</option>
        {options.map((opt, i) => (
          <option key={i} value={opt} className="text-sm text-gray-300">
            {opt}
          </option>
        ))}
      </select>
    </BaseNode>
  );
};

export default OptionNode;
