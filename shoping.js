// create an empty array to hold the items in the shopping list
let shoppingList = [];

// function to add an item to the shopping list
function addItem(item) {
  shoppingList.push(item);
}

// function to remove an item from the shopping list
function removeItem(item) {
  let index = shoppingList.indexOf(item);
  if (index !== -1) {
    shoppingList.splice(index, 1);
  }
}

// function to print out the shopping list
function printList() {
  console.log("Shopping List:");
  for (let i = 0; i < shoppingList.length; i++) {
    console.log("- " + shoppingList[i]);
  }
}

// example usage
addItem("Apples");
addItem("Bananas");
addItem("Milk");
printList();

// output:
// Shopping List:
// - Apples
// - Bananas
// - Milk

removeItem("Bananas");
printList();

// output:
// Shopping List:
// - Apples
// - Milk
