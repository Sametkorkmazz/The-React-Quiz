function Options({ options, answer, correctOption, onAnswer, currQuestion }) {
  return (
    <div className="options">
      {options.map((option, index) => (
        <button
          className={`btn btn-option ${answer.at(currQuestion) === index ? "answer" : ""} ${answer.at(currQuestion) != null ? (index === correctOption ? "correct" : "wrong") : ""}`}
          key={option}
          onClick={() => {
            onAnswer(index);
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
