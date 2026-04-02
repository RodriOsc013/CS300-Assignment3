const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
const results = document.querySelector("#results");
const mealDetails = document.querySelector("#mealDetails");
const statusMessage = document.querySelector("#statusMessage");
const categoryFilter = document.querySelector("#categoryFilter");
const modal = document.getElementById("mealModal");
const closeModal = document.getElementById("closeModal");
statusMessage.textContent = "Search for a recipe to begin.";
function openMeal() {
  modal.classList.remove("hidden");
}
function closeMeal() {
  modal.classList.add("hidden");
}
closeModal.addEventListener("click", closeMeal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeMeal();
});
searchBtn.addEventListener("click", fetchMeals);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchMeals();
});
categoryFilter.addEventListener("change", fetchMeals);
async function fetchMeals() {
  const query = searchInput.value.trim();
  results.innerHTML = "";
  mealDetails.innerHTML = "";
  statusMessage.textContent = "Loading...";
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await response.json();
    let meals = data.meals;
    if (!meals) {
      statusMessage.textContent =
        "No recipes found. Showing popular chicken recipes instead.";
      const fallback = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken"
      );
      const fallbackData = await fallback.json();
      meals = fallbackData.meals;
    } else {
      statusMessage.textContent = "";
    }
    displayMeals(meals);
  } catch (error) {
    displayError();
  }
}
function displayMeals(meals) {
  results.innerHTML = "";
  if (!meals || meals.length === 0) {
    statusMessage.textContent =
      "No recipes found. Try 'chicken', 'beef', 'pasta', or 'dessert'.";
    return;
  }
  const category = categoryFilter.value;
  let filteredMeals = meals;
  if (category) {
    filteredMeals = meals.filter(
      (meal) => meal.strCategory.toLowerCase() === category.toLowerCase()
    );
    if (!filteredMeals.length) filteredMeals = meals;
  }
  filteredMeals.forEach((meal) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${meal.strMealThumb}">
      <h3>${meal.strMeal}</h3>
      <p class="category">${meal.strCategory}</p>
    `;
    card.addEventListener("click", () => fetchMealDetails(meal.idMeal));
    results.appendChild(card);
  });
}
async function fetchMealDetails(id) {
  mealDetails.innerHTML = "<p>Loading...</p>";
  openMeal();
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();
    displayMealDetails(data.meals[0]);
  } catch (error) {
    displayError();
  }
}
function displayMealDetails(meal) {
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients += `<li>${ingredient} - ${measure}</li>`;
    }
  }
  mealDetails.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <div class="recipe-section">
      <h3>Ingredients</h3>
      <ul class="ingredients">
        ${ingredients}
      </ul>
    </div>
    <div class="recipe-section">
      <h3>Instructions</h3>
      <p class="instructions">${meal.strInstructions}</p>
    </div>
    ${
      meal.strYoutube
        ? `<div class="recipe-section">
             <h3>Video</h3>
             <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>
           </div>`
        : ""
    }
  `;
}
function displayError() {
  statusMessage.textContent = "Something went wrong. Try again.";
}