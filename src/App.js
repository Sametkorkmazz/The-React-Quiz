import { useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Utils/Loader";
import Error from "./components/Utils/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question/Question";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Button from "./components/Utils/Button";
import Timer from "./components/Timer";
import questions from "./data/questions";

const QuizStatus = {
  LOADING: "LOADING",
  ERROR: "ERROR",
  READY: "READY",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
  REVIEW: "REVIEW",
};

export const Action = {
  DATA_RECEIVED: "DATA_RECEIVED",
  DATA_FAILED: "DATA_FAILED",
  START: "START",
  ANSWER: "ANSWER",
  NEXT_QUESTION: "NEXT_QUESTION",
  FINISH: "FINISH",
  RESTART: "RESTART",
  SELECT_NUM_QUESTIONS: "SELECT_NUM_QUESTIONS",
  SELECT_DIFFICULTY: "SELECT_DIFFICULTY",
  REVIEW: "REVIEW",
};

const initialState = {
  questions: questions,
  status: QuizStatus.READY,
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  totalTime: null,
  numQuestionsToAnswer: questions.length,
  difficulty: Math.min(...questions.map((a) => a.points)),
  questionsToAnswer: [],
};
const SECONDS_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case Action.DATA_FAILED:
      return { ...state, status: QuizStatus.ERROR };
    case Action.SELECT_DIFFICULTY:
      return {
        ...state,
        difficulty: action.payload,
        numQuestionsToAnswer: state.questions.filter(
          (q) => q.points >= action.payload,
        ).length,
      };
    case Action.SELECT_NUM_QUESTIONS:
      return {
        ...state,
        numQuestionsToAnswer: action.payload,
      };
    case Action.START:
      return {
        ...state,
        answer: Array.from(
          { length: state.numQuestionsToAnswer },
          (_, i) => null,
        ),
        status: QuizStatus.ACTIVE,
        totalTime: SECONDS_PER_QUESTION * state.numQuestionsToAnswer,
      };
    case Action.ANSWER:
      const isCorrect = action.correctOption === action.payload;
      return {
        ...state,
        answer: state.answer.toSpliced(state.index, 1, action.payload),
        points: state.points + (isCorrect ? action.points : 0),
      };
    case Action.NEXT_QUESTION:
      return {
        ...state,
        index: state.index + 1,
      };
    case Action.FINISH:
      return {
        ...state,
        status: QuizStatus.FINISHED,
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case Action.RESTART:
      return {
        ...initialState,
        status: QuizStatus.READY,
        highscore: state.highscore,
        questions: state.questions,
        numQuestionsToAnswer: state.questions.length,
        difficulty: Math.min(...state.questions.map((a) => a.points)),
      };
    case Action.REVIEW:
      return {
        ...state,
        status: QuizStatus.REVIEW,
        index: 0,
      };
    default:
      throw new Error("Unknown action");
  }
}

function App() {
  const [
    {
      status,
      questions,
      index,
      answer,
      points,
      highscore,
      totalTime,
      numQuestionsToAnswer,
      difficulty,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const questionsToAnswer = questions
    .filter((question) => question.points >= difficulty)
    .slice(0, numQuestionsToAnswer);

  const totalPoints = questionsToAnswer.reduce(
    (acc, curr) => curr.points + acc,
    0,
  );
  const numQuestions = questionsToAnswer.length;
  return (
    <div className="app">
      <Header />
      <Main>
        {status === QuizStatus.LOADING && <Loader />}
        {status === QuizStatus.ERROR && <Error />}
        {status === QuizStatus.READY && (
          <StartScreen
            numQuestionsToAnswer={numQuestionsToAnswer}
            difficulty={difficulty}
            numQuestions={numQuestions}
            dispatch={dispatch}
            difficulties={[...new Set(questions.map((q) => q.points))].sort()}
          />
        )}
        {status === QuizStatus.REVIEW && (
          <>
            <Question
              index={index}
              question={questionsToAnswer[index]}
              answer={answer}
              dispatch={dispatch}
            />
            {index < numQuestions - 1 ? (
              <Button onClick={() => dispatch({ type: Action.NEXT_QUESTION })}>
                Next
              </Button>
            ) : (
              <Button onClick={() => dispatch({ type: Action.FINISH })}>
                Finish Review
              </Button>
            )}
          </>
        )}
        {status === QuizStatus.ACTIVE && (
          <>
            <Progress
              index={index}
              points={points}
              numQuestions={numQuestions}
              answer={answer}
              totalPoints={totalPoints}
            />
            <Question
              index={index}
              question={questionsToAnswer[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <footer>
              <Timer totalTime={totalTime} dispatch={dispatch} />

              {answer.at(index) !== null &&
                (index < numQuestions - 1 ? (
                  <Button
                    onClick={() => dispatch({ type: Action.NEXT_QUESTION })}
                  >
                    Next
                  </Button>
                ) : (
                  <Button onClick={() => dispatch({ type: Action.FINISH })}>
                    Finish
                  </Button>
                ))}
            </footer>
          </>
        )}
        {status === QuizStatus.FINISHED && (
          <>
            <FinishScreen
              points={points}
              maxPossiblePoints={totalPoints}
              highscore={highscore}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={() => dispatch({ type: Action.REVIEW })}>
                Review
              </Button>
              <Button onClick={() => dispatch({ type: Action.RESTART })}>
                Restart
              </Button>
            </div>
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
