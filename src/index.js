import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1, input, textarea } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
const inputStyle = "border p-2 mb-2 w-full";
const textAreaStyle = "border p-2 mb-2 w-full h-24 resize-none";  // For larger input in edit mode

// Messages which can be used to update the model
const MSGS = {
  ADD_FLASHCARD: "ADD_FLASHCARD",
  DELETE_FLASHCARD: "DELETE_FLASHCARD",
  UPDATE_FLASHCARD: "UPDATE_FLASHCARD",
  UPDATE_QUESTION: "UPDATE_QUESTION",
  UPDATE_ANSWER: "UPDATE_ANSWER",
  EDIT_FLASHCARD: "EDIT_FLASHCARD",
  RATE_FLASHCARD: "RATE_FLASHCARD",
  SHOW_FLASHCARD: "SHOW_FLASHCARD",
  SAVE_EDIT: "SAVE_EDIT"
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center w-full" }, [
    h1({ className: "text-2xl" }, "Quiz Cards"),

    // Input form for adding flashcards
    div({ className: "flex gap-4 w-full" }, [
      input({
        className: inputStyle,
        type: "text",
        placeholder: "Question",
        value: model.currentQuestion,
        oninput: (e) => dispatch({ type: "UPDATE_QUESTION", question: e.target.value }),
      }),
      input({
        className: inputStyle,
        type: "text",
        placeholder: "Answer",
        value: model.currentAnswer,
        oninput: (e) => dispatch({ type: "UPDATE_ANSWER", answer: e.target.value }),
      }),
      button({ className: btnStyle, onclick: () => dispatch({ type: "ADD_FLASHCARD" }) }, "+ Add Flashcard"),
    ]),

    // Render the flashcards only if there are any in the model

    // Generated Code (AI)
    model.flashcards.length > 0
      ? div({ className: "flex flex-col gap-4 w-full" }, model.flashcards.map((card, index) => flashcardView(dispatch, card, index, model)))
      : p({}, "No flashcards yet. Add one!")
  ]);
}

// Flashcard view function to render each flashcard
function flashcardView(dispatch, card, index, model) {
  return div({ className: "border p-4 rounded shadow-md w-full" }, [
    card.editMode
      ? div({ className: "flex flex-col" }, [
          textarea({
            className: textAreaStyle,
            value: card.question,
            oninput: (e) => dispatch({ type: "UPDATE_FLASHCARD", index, question: e.target.value, field: 'question' }),
          }),
          textarea({
            className: textAreaStyle,
            value: card.answer,
            oninput: (e) => dispatch({ type: "UPDATE_FLASHCARD", index, answer: e.target.value, field: 'answer' }),
          }),
          button({ className: btnStyle, onclick: () => dispatch({ type: "SAVE_EDIT", index }) }, "Save"),
        ])
      // Generated Code
      : div({}, [
          p({ className: "font-bold" }, `Question: ${card.question}`),
          card.showAnswer ? p({}, `Answer: ${card.answer}`) : button({ className: btnStyle, onclick: () => dispatch({ type: MSGS.SHOW_FLASHCARD, index }) }, "Show Answer"),
        ]),

    // Rating buttons
    div({ className: "flex gap-2 mt-4" }, [
      button({ className: "bg-red-500 text-white px-4 py-2", onclick: () => dispatch({ type: MSGS.RATE_FLASHCARD, index, ratingChange: 0 }) }, "Bad"),
      button({ className: "bg-yellow-500 text-white px-4 py-2", onclick: () => dispatch({ type: MSGS.RATE_FLASHCARD, index, ratingChange: 1 }) }, "Good"),
      button({ className: "bg-green-500 text-white px-4 py-2", onclick: () => dispatch({ type: MSGS.RATE_FLASHCARD, index, ratingChange: 2 }) }, "Great"),
    ]),

    // Edit and delete buttons
    div({ className: "flex justify-between mt-4" }, [
      button({ className: "text-blue-500", onclick: () => dispatch({ type: MSGS.EDIT_FLASHCARD, index }) }, "Edit"),
      button({ className: "text-red-500", onclick: () => dispatch({ type: MSGS.DELETE_FLASHCARD, index }) }, "Delete"),
    ])
  ]);
}

// Update function which takes a message and a model and returns a new/updated model
// Generated Code (AI)
function update(msg, model) {
  switch (msg.type) {
    case MSGS.ADD_FLASHCARD:
      if (model.currentQuestion && model.currentAnswer) {
        const newFlashcard = { question: model.currentQuestion, answer: model.currentAnswer, rating: 0, showAnswer: false, editMode: false };
        return {
          ...model,
          flashcards: [...model.flashcards, newFlashcard],
          currentQuestion: "",
          currentAnswer: "",
        };
      }
      return model;

    // Generated Code (AI)
    case MSGS.DELETE_FLASHCARD:
      const filteredFlashcards = model.flashcards.filter((_, idx) => idx !== msg.index);
      return { ...model, flashcards: filteredFlashcards };

    case MSGS.UPDATE_QUESTION:
      return { ...model, currentQuestion: msg.question };

    case MSGS.UPDATE_ANSWER:
      return { ...model, currentAnswer: msg.answer };

    // Generated Code (AI)
    case MSGS.SHOW_FLASHCARD:
      const updatedFlashcards = model.flashcards.map((card, idx) =>
        idx === msg.index ? { ...card, showAnswer: !card.showAnswer } : card
      );
      return { ...model, flashcards: updatedFlashcards };

    // Generated Code (AI)
    case MSGS.EDIT_FLASHCARD:
      const flashcardsWithEdit = model.flashcards.map((card, idx) =>
        idx === msg.index ? { ...card, editMode: !card.editMode } : card
      );
      return { ...model, flashcards: flashcardsWithEdit };

    // Generated Code (AI)
    case MSGS.UPDATE_FLASHCARD:
      const editedFlashcards = model.flashcards.map((card, idx) => {
        if (idx === msg.index) {
          return {
            ...card,
            [msg.field]: msg[msg.field], // Update the correct field (question or answer)
          };
        }
        return card;
      });
      return { ...model, flashcards: editedFlashcards };

    // Generated Code (AI)
    case MSGS.SAVE_EDIT:
      const savedFlashcards = model.flashcards.map((card, idx) =>
        idx === msg.index ? { ...card, editMode: false } : card
      );
      return { ...model, flashcards: savedFlashcards };

    case MSGS.RATE_FLASHCARD:
      return updateRating(model, msg.index, msg.ratingChange);

    default:
      return model;
  }
}

// Helper function to update the rating of a flashcard and sort the flashcards
// Generated Code (AI)
function updateRating(model, index, ratingChange) {
  // Update the rating of the flashcard
  const updatedFlashcards = model.flashcards.map((card, idx) =>
    idx === index ? { ...card, rating: ratingChange } : card
  );

  // Sort the flashcards based on their rating in descending order
  const sortedFlashcards = updatedFlashcards.sort((a, b) => b.rating - a.rating);

  return { ...model, flashcards: sortedFlashcards };
}

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.innerHTML = ''; // Ensure node is cleared before appending
  node.appendChild(rootNode);

  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// The initial model when the app starts
const initModel = {
  currentQuestion: "",
  currentAnswer: "",
  flashcards: [],
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");
app(initModel, update, view, rootNode);
