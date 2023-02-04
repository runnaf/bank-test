document.addEventListener("DOMContentLoaded", function () {
  const btnAdd = document.querySelector(".data__btn-add");
  const fieldList = document.querySelector(".data__field-list");
  const template = document
    .querySelector("#item")
    .content.querySelector(".data__field-item");
  const page = document.querySelector(".page");
  const form = document.querySelector(".form");

  // Функция для удаления строки с полями формы

  function removeItem() {
    const dataList = document.querySelectorAll(".data__field-item");

    dataList.forEach((item) => {
      const btnRemove = item.querySelector(".data__btn-remove-item");

      btnRemove.addEventListener("click", () => {
        item.remove();
      });
    });
  }

  // Функция для добавления строки с полями формы

  function addItem() {
    btnAdd.addEventListener("click", () => {
      const itemList = template.cloneNode(true);
      fieldList.appendChild(itemList);
      removeItem();
    });
  }

  // Функция валидация данных полей формы

  function validationForm(form) {
    //Функция для удаления сообщения об ошибки валидации

    function removeError(input) {
      const parent = input.parentNode;

      if (parent.classList.contains("error")) {
        parent.querySelector(".error-text").remove();
        parent.classList.remove("error");
      }
    }

    // Функция для появления сообщения об ошибки валидации

    function createError(input, text) {
      const parent = input.parentNode;
      const errorTextContainer = document.createElement("p");

      errorTextContainer.classList.add("error-text");
      errorTextContainer.textContent = text;

      parent.classList.add("error");

      parent.append(errorTextContainer);
    }

    let result = true;

    const allInputs = form.querySelectorAll("input");
    const select = form.querySelector("select");
    const textArea = form.querySelector("textarea");

    // Проверка валидации с использование data атрибутов

    for (const input of allInputs) {
      let val = input.value;
      removeError(input);
      removeError(select);
      removeError(textArea);

      if (input.dataset.minLength && val.length < input.dataset.minLength) {
        removeError(input);
        createError(
          input,
          `Минимальное кол-во символов: ${input.dataset.minLength}`
        );
        result = false;
      }

      if (input.dataset.maxLength && val.length > input.dataset.maxLength) {
        removeError(input);
        createError(
          input,
          `Максимальное кол-во символов: ${input.dataset.maxLength}`
        );
        result = false;
      }

      if (
        input.dataset.age === "true" &&
        (parseInt(val) < 18 || parseInt(val) > 100)
      ) {
        removeError(input);
        createError(
          input,
          "Ваш возраст должен быть больше 18 лет, но меньше 100"
        );
        result = false;
      }

      if (input.dataset.required == "true" && input.value === "") {
        removeError(input);
        createError(input, "Поле не заполнено!");
        result = false;
      }
    }

    if (select.value === "") {
      removeError(select);
      createError(select, "Выберете пожалуйста профессию");
      result = false;
    }

    if (textArea.value == "") {
      removeError(textArea);
      createError(textArea, "Поле не заполнено!");
      result = false;
    }

    return result;
  }

  form.addEventListener("submit", formSend);

  // Функция обработки формы при отправке

  async function formSend(e) {
    let formObject = document.querySelector(".form");
    e.preventDefault();

    let formData = new FormData(formObject);

    if (validationForm(form)) {
      page.classList.add("sending");

      let response = await fetch("http://localhost:8000/post.php", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Allow: "GET, POST, HEAD, OPTIONS",
          "Access-Control-Allow-Methods":
            "GET, POST, OPTIONS, PUT, PATCH, DELETE",
          Origin: "http://localhost:3000",
        },
        body: getData(formData),
      });

      if (response.ok) {
        console.log(getData(formData));
        form.reset();
        page.classList.remove("sending");
      } else {
        alert("Ошибка");
        page.classList.remove("sending");
      }
    }
  }

  // Функция вывода данных в консоль

  function getData(form) {
    let object = {};

    form.forEach((value, key) => {
      if (!Reflect.has(object, key)) {
        object[key] = value;
        return;
      }

      if (!Array.isArray(object[key])) {
        object[key] = [object[key]];
      }

      object[key].push(value);
    });

    let json = JSON.stringify(object);
    return json;
  }

  removeItem();
  addItem();
});
