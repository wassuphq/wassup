import { showModal } from "./modal";
import { localizeDateTime } from "./localize_datetime";

const csrfTokenSelector = "input[name='_csrf_token']";
const noteBodyFieldSelector = "textarea[name='note[body]']";
const noteSentimentRadioSelector = "input[name='note[sentiment]']:checked";

const formToJSON = form => {
  return {
    _csrf_token: form.querySelector(csrfTokenSelector).value,
      note: {
      body: form.querySelector(noteBodyFieldSelector).value,
        sentiment: form.querySelector(noteSentimentRadioSelector).value
    }
  };
};

const submitForm = (url, data, { onSuccess, onFailure }) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = () => {
    if (xhr.status === 200) {
      onSuccess();
    } else {
      onFailure();
    }
  };

  xhr.send(JSON.stringify(data));
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".note-form");
  if (!form) return;

  const url = form.getAttribute("action");

  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = formToJSON(event.target);
    submitForm(
      url,
      data,
      { onSuccess: () => { form.reset() }, onFailure: () => {}}
    );
  });
});

document.addEventListener('click', ({target}) => {
  if (target.getAttribute('data-behavior') === "note-preview-trigger") {
    const {
      submitted_at,
      sentiment,
      body,
      favorite_icon_path
    } = JSON.parse(target.getAttribute('data-note'));
    const localDateTime =
      localizeDateTime(submitted_at).format('MMM DD, YYYY - hh:mm:ss A');

    showModal(`
      <div class="note-preview">
        <div class="meta">
          <span class="submitted">${localDateTime}</span>
          <img class="emoji-icon" src="/images/${sentiment}.svg" />
          <img class="emoji-icon" src="${favorite_icon_path}" />
        </div>
        <p>${body}</p>
      </div>
    `);
  }
}, false)
