const Btn = ({ click, text, id }) => {
  return (
    <button id={id} onClick={click}>
      {text}
    </button>
  );
};

export default Btn;
