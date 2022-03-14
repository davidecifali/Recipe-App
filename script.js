// variables 

const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");



// event listeners

searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", closeRecipe);



// get meal list that matches with the ingredients

function getMealList() {
    let searchInputTxt = document.getElementById("search-input").value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if (data.meals) {
            data.meals.forEach(meal => {
                html += `
                <div class="meal-item" data-id="${meal.idMeal}">
                 <div class="meal-img">
                  <img src="${meal.strMealThumb}" alt="food">
                  </div>
                  <div class="meal-name">
                   <h3>${meal.strMeal}</h3>
                   <a href="#" class="recipe-btn">Get Recipe</a>
                  </div>
                </div>
                `;
            });
            mealList.classList.remove("notFound");

        // delete background image when recipes are found
        const noImg = document.head.appendChild(document.createElement("style"));
           noImg.innerHTML = ".container::before {background-image: none;}";
        }         
        else {
            html = "Sorry, we didn't find any recipe!";
            mealList.classList.add("notFound");
            }

        mealList.innerHTML = html;
    })

}


// get recipe of the meal

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains("recipe-btn")) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
  }
}


// create a modal

function mealRecipeModal(meal) {
    
    meal = meal[0];

    // get ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++)
{
    if (meal["strIngredient" + i])
{
    ingredients.push(
        `${meal["strIngredient" + i]} - ${meal["strMeasure" + i]}`
    );
} else {
    break;
}
}  
// show meal info  
let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <div class="recipe-instructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
        <h3 class="ingredients">Ingredients:</h3>
        <ul>
        ${ingredients.map((ing) => `
        <li>${ing}</li>
        `
        ).join("")}
        </ul>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add("showRecipe");
}


// close the recipe window

function closeRecipe() {
    mealDetailsContent.parentElement.classList.remove("showRecipe");
}