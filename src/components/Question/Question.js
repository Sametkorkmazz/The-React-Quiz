import { Action } from "../../App";
import Options from "./Options";

function Question({ question, answer, dispatch, index }) {
  function onAnswer(index) {
    dispatch({
      type: Action.ANSWER,
      payload: index,
      correctOption: question.correctOption,
      points: question.points,
    });
  }
  return (
    <div>
      <h4>{question.question}</h4>
      <Options
        currQuestion={index}
        options={question.options}
        answer={answer}
        onAnswer={onAnswer}
        correctOption={question.correctOption}
      />
    </div>
  );
}

export default Question;
