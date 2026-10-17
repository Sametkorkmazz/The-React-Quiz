import { Action } from "../App";

function StartScreen({
  numQuestions,
  dispatch,
  difficulties,
  numQuestionsToAnswer,
  difficulty,
}) {
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ fontSize: "2.5rem", display: "flex", gap: "0.5rem" }}>
          <label>Num of questions: </label>
          <select
            value={numQuestionsToAnswer}
            onChange={(e) =>
              dispatch({
                type: Action.SELECT_NUM_QUESTIONS,
                payload: e.target.value,
              })
            }
          >
            {Array.from({ length: numQuestions }, (_, index) => (
              <option value={index + 1}>{index + 1}</option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: "2.5rem", display: "flex", gap: "0.5rem" }}>
          <label>Difficulty: </label>
          <select
            value={difficulty}
            onChange={(e) =>
              dispatch({
                type: Action.SELECT_DIFFICULTY,
                payload: e.target.value,
              })
            }
          >
            {difficulties.map((diff) => (
              <option value={diff}>{diff}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={function () {
          dispatch({ type: Action.START });
        }}
        className="btn btn-ui"
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
