import { createCarouselItem, clear, appendCarousel, start } from "./Carousel";

// Axios instance
const axiosInstance = axios.create({
  baseURL: "https://api.thecatapi.com/v1",
  headers: { "x-api-key": "YOUR_API_KEY_HERE" }
});

// Function to display the progress bar
function showProgressBar() {
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = "0%";
  progressBar.style.display = "block";

  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      progressBar.style.display = "none";
    } else {
      width += 10;
      progressBar.style.width = `${width}%`;
    }
  }, 100);
}

// Function to load breeds into the select dropdown
async function loadBreeds() {
  try {
    const response = await axiosInstance.get("/breeds");
    const breedSelect = document.getElementById("breedSelect");
    response.data.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading breeds:", error);
  }
}

// Function to get images for a specific breed
async function getImages(breedId) {
  try {
    showProgressBar();
    const response = await axiosInstance.get("/images/search", {
      params: {
        breed_id: breedId,
        limit: 10
      }
    });
    clear();
    response.data.forEach(image => {
      const carouselItem = createCarouselItem(image.url, image.id, image.id);
      appendCarousel(carouselItem);
    });
    start();
  } catch (error) {
    console.error("Error getting images:", error);
  }
}

// Function to mark an image as favorite
export async function favourite(imageId) {
  try {
    await axiosInstance.post("/favourites", {
      image_id: imageId
    });
    alert("Image added to favorites!");
  } catch (error) {
    console.error("Error adding to favorites:", error);
  }
}

// Function to get favorite images
async function getFavorites() {
  try {
    showProgressBar();
    const response = await axiosInstance.get("/favourites");
    clear();
    response.data.forEach(fav => {
      const carouselItem = createCarouselItem(fav.image.url, fav.id, fav.id);
      appendCarousel(carouselItem);
    });
    start();
  } catch (error) {
    console.error("Error getting favorites:", error);
  }
}

// Event listeners
document.getElementById("breedSelect").addEventListener("change", event => {
  getImages(event.target.value);
});

document.getElementById("getFavouritesBtn").addEventListener("click", () => {
  getFavorites();
});

// Initial load
loadBreeds();
