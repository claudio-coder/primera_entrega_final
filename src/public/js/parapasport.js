console.log("estamos aca");
const form = document.querySelector("cookieForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/session/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((respuesta) => respuesta.json())
    .then((respuesta) => {
      console.log(respuesta);
      localStorage.setItem("token", respuesta.access_token);
    });
});

// const getCookie = () => {
//   console.log(document.cookie);
// };
