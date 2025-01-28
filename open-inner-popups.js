// List of categories for popups
const categories = [
  { id: "vegitablesx", contentId: "vegitables" },
  { id: "Fruitsx", contentId: "fruits" },
  { id: "oilsx", contentId: "oils" },
  { id: "cafeteriax", contentId: "cafeteria" },
  { id: "restaurantsx", contentId: "restaurants" },
  { id: "Bakeryx", contentId: "bakery" },
  { id: "meatx", contentId: "meat" },
  { id: "seafoodx", contentId: "seafood" },
  { id: "spicesx", contentId: "spices" },
  { id: "beveragesx", contentId: "beverages" },
  { id: "beautyx", contentId: "beauty" },
  { id: "dairyx", contentId: "dairy" },
  { id: "eggsx", contentId: "eggs" },
  { id: "readytocookx", contentId: "readytocook" },
  { id: "snacksx", contentId: "snacks" },
  { id: "riceandgrainsx", contentId: "riceandgrains" },
  { id: "legumesx", contentId: "legumes" },
  { id: "sweatsx", contentId: "sweats" },
  { id: "delicatessenx", contentId: "delicatessen" },
  { id: "nutsx", contentId: "nuts" },
  { id: "cannedfoodx", contentId: "cannedfood" },
  { id: "frozenx", contentId: "frozen" },
  { id: "teaandcoffeex", contentId: "teaandcoffee" },
  { id: "seasoningx", contentId: "seasoning" },
  { id: "spreadsx", contentId: "spreads" },
  { id: "noodlesandpastax", contentId: "noodlesandpasta" },
  { id: "babiesx", contentId: "babies" },
  { id: "personalcarex", contentId: "personalcare" },
];

// Attach dynamically generated popups to the document
const body = document.body;

categories.forEach((category) => {
  // Create popup container
  const popup = document.createElement("div");
  popup.id = category.id;
  popup.className = "inner-popup popup";
  popup.style.display = "none";

  // Create popup content
  const content = document.createElement("div");
  content.className = "popup-content";
  content.id = category.contentId;

  // Append content to popup
  popup.appendChild(content);

  // Append popup to the body (or another container, if preferred)
  body.appendChild(popup);
});

// Example: Function to open a popup
function openInnerPopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.style.display = "block";
  }
}
