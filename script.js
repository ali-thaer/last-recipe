(function eventHandler() {
    const searchBar = document.getElementById("search-bar");
    const modalBackground = document.querySelector(".modal-background");
    const modal = document.querySelector(".modal");
    const errorModal = document.querySelector(".error-modal");
    const recipeTitle = document.getElementById("recipe-title");
    const servings = document.getElementById("servings");
    const ingredientList = document.getElementById("ingredient-list");
    const instructionsList = document.getElementById("instructions-list"); // Changed from instruction-list
    
    searchBar.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const data = await fetchRecipe(searchBar.value);

            if (data) {
                openModal(modalBackground, modal, errorModal);
                recipeTitle.textContent = data.title;
                servings.textContent = data.servings;

                // Clear existing ingredients
                ingredientList.innerHTML = '';
                
                // Add new ingredients
                if (data.ingredients && Array.isArray(data.ingredients)) {
                    data.ingredients.forEach(ingredient => {
                        let listItem = document.createElement("li");
                        listItem.textContent = ingredient;
                        ingredientList.appendChild(listItem);
                    });
                }

                instructionsList.innerHTML = '';

                if (data.instructions && typeof data.instructions === 'string') {
                    const instructions = data.instructions
                        .split('.')
                        .filter(instruction => instruction.trim().length > 0);
                        
                    instructions.forEach(instruction => {
                        let instructionItem = document.createElement("li");
                        instructionItem.textContent = instruction.trim();
                        instructionsList.appendChild(instructionItem);
                    });
                }
            }
            else {
                modalBackground.classList.remove("hidden");
                errorModal.classList.remove("hidden");
            }
        }
     });

    modalBackground.addEventListener("click", () => {
        closeModal(modalBackground, modal, errorModal);
    });
})();

async function fetchRecipe(searchInput) {
    if (searchInput.trim() === "") {
        console.log("empty input!");
        return null;
    }

    const recipeTitle = 'https://api.api-ninjas.com/v2/recipe?ingredients='+searchInput;
    const myAPIKey = 'INSERT API KEY HERE';

    try {
        const response = await fetch(recipeTitle, {
            headers: { 'X-Api-Key': myAPIKey }
        });

        if (!response.ok) {
            console.log("Bad response! ", response.status);
            document.getElementById("search-bar").value = "";
            return null;
        }

        const data = await response.json();
        if (data.length === 0) {
            console.log("Something went wrong here.");
            document.getElementById("search-bar").value = "";
            return null;
        }

        document.getElementById("search-bar").value = "";
        return data[0];
    } catch (error) {
        console.error("Error fetching recipe:", error);
        return null;
    }
}

function openModal(modalBackground, modal) {
    if (modalBackground && modal) {
        modalBackground.classList.remove("hidden");
        modal.classList.remove("hidden");
    }
}

function closeModal(modalBackground, modal, errorModal) {
    if (modalBackground) {
        modalBackground.classList.add("hidden");
        if (modal) modal.classList.add("hidden");
        if (errorModal) errorModal.classList.add("hidden");
    }
}