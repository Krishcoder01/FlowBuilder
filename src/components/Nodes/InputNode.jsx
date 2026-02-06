import BaseNode from "./BaseNode";

const InputNode = ({ id, data, updateNodeData, ...rest }) => {
  return (
    <BaseNode id={id} data={data} {...rest}>
      <div className="font-bold text-lg mb-3 ">Input Node</div>
      <div className="p-2 px-4 rounded-xl bg-[#2d2d2f]">
        <input
        value={data.value || ""}
        placeholder="User input ... "
        className="w-full rounded px-2 py-1 text-xs border-none active:border-none focus:ring-0 focus:outline-none bg-[#2d2d2f] text-white"
        onChange={(e) =>
          updateNodeData(id, { value: e.target.value })
        }
      />
      </div>
    </BaseNode>
  );
};

export default InputNode;
