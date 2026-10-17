function Button({ onClick, children }) {
  return (
    <button className="btn btn-ui" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
