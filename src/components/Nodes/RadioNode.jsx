import BaseNode from "./BaseNode";

const RadioNode = ({ id, data, updateNodeData, ...rest }) => {
  const options = data.options || ["A", "B"];

  return (
    <BaseNode id={id} data={data} {...rest}>
      <div className="font-bold text-lg mb-3">Radio Node</div>

      <div className=" text-xs flex items-center gap-5">
        {options.map((opt) => (
          <label key={opt} className="flex items-center text-xl font-bold gap-1">
            <input

              type="radio"
              checked={data.selected === opt}
              onChange={() =>
                updateNodeData(id, { selected: opt })
              }
              className = "scale-110"
            />
            {opt}
            
          </label>
        ))}
      </div>
    </BaseNode>
  );
};

export default RadioNode;
