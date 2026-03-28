const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
const results = document.querySelector("#results");
const mealDetails = document.querySelector("#mealDetails");
const statusMessage = document.querySelector("#statusMessage");
const categoryFilter = document.querySelector("#categoryFilter");
statusMessage.textContent = "Search for a recipe to begin.";
searchBtn.addEventListener("click", () => fetchMeals());
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchMeals();
});
categoryFilter.addEventListener("change", () => fetchMeals());
const fetchMeals = async () => {
  const query = searchInput.value.trim();

  statusMessage.textContent = "Loading...";
  results.innerHTML = "";
  mealDetails.innerHTML = "";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    displayMeals(data.meals);

  } catch (error) {
    displayError(error.message);
  }
};

// DISPLAY RESULTS
const displayMeals = (meals) => {
  results.innerHTML = "";

  if (!meals) {
    statusMessage.textContent = "No results found.";
    return;
  }

  statusMessage.textContent = "";

  const category = categoryFilter.value;

  meals
    .filter(meal => !category || meal.strCategory === category)
    .forEach(meal => {

      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strCategory}</p>
      `;

      card.addEventListener("click", () => fetchMealDetails(meal.idMeal));

      results.appendChild(card);
    });
};
const fetchMealDetails = async (id) => {
  mealDetails.innerHTML = "Loading...";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch details");
    }

    const data = await response.json();
    displayMealDetails(data.meals[0]);

  } catch (error) {
    displayError(error.message);
  }
};
const displayMealDetails = (meal) => {
  mealDetails.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" width="300">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p>${meal.strInstructions}</p>
  `;
};
// ERROR HANDLING
const displayError = () => {
  statusMessage.textContent = "Something went wrong. Try again.";
};