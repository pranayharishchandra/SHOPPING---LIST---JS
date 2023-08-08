/*   ==== MORE FUNCTIONALITIES TO BE ADDED LATER =====================
 * 
 * ADD A "SORT BUTTON", TO SORT ITEMS 
 * LEXICOGRAMPHICALLY
 * PRIORITY -- MAKE A FIELD THAT TAKES PRIORITY (TO MAKE TODO LIST)  
 * RECENTLY ADDED
 */


const itemForm   = document.getElementById('item-form');    // 32 -- <form id="item-form">
const itemInput  = document.getElementById('item-input');  // 39 -- enter item
const itemList   = document.getElementById('item-list');    // 67 -- <ul id="item-list" class="items">
const clearBtn   = document.getElementById('clear');        // 76 -- <button id="clear" class="btn-clear">Clear All</button>
const itemFilter = document.getElementById('filter');     // 56 -- <div class="filter">
const formBtn    = itemForm.querySelector('button[type="submit"]');         // 48 - clear item, 70 - remove item cross, 94 - clear all
const htmlBody   = document.body;

let isEditMode   = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

/* onAddItemSubmit --- function will be called -- submit button clicked */
function onAddItemSubmit(e) {
    e.preventDefault(); // what is this????

    const newItem = itemInput.value;

    // Validate Input
    if (newItem === '') {
      alert('Please add an item');
      return;
    }

    // Check for edit mode -- if on -- modify the current item
    if (isEditMode) {
      const itemToEdit = itemList.querySelector('.edit-mode');

      removeItemFromStorage(itemToEdit.textContent);

      itemToEdit.classList.remove('edit-mode');
      itemToEdit.remove();

      isEditMode = false; // so we don't keep on updating the item with class 'edit-mode'
                          // since our editing work is over, don't update the li
                          // untill user clicks some li to edit
                          // if user clicks the li, then turn on the isEditMode
    } 
    else if (checkIfItemExists(newItem)){
        alert('That item already exists!');
        return;
    }

    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    // itemInput.value = '';
}


// CREATING LI ITEM AND ADDING IT TO ITEM-LIST
function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red'); // calling create button function
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage(); // array of values with key as 'items'

  // Add new item to array
  itemsFromStorage.push(item);

  // sorting the array of items
  // const sortedArray = [...itemsFromStorage].sort(); // since sort() works on numbers, so using sort operator
  // const sortedArray = itemsFromStorage.sort();         // sorting string array, it's wrong syntax... it return the 

  itemsFromStorage.sort(); // but IDK how to sort the dom 

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

/* RETRIVING ALL ITEMS FROM LOCAL STORAGE IN FORM OF ARRAY*/
function getItemsFromStorage() {
  let itemsFromStorage;

  //  localStorage -- reserved keyword, getItem -- retrives values with 'items' as keys
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items')); // am array of item with key as 'items'
  }

  return itemsFromStorage;
}


/** CLICKING LI -- only li or X red cross 
 * REMOVING ITEM ON CLICKING RED CROSS ICON WHICH IS IN THE BUTTON 
 * logic --> the target is the red button.. but if you delete directly then cross will 0nly we removed
 * so to avoid that problem go to the parent of that icon.. until you find li
 */
function onClickItem(e) {
  console.log("start - onClickItem")
  /* icon <- button <- li <- ul <- div <- body <- html document 
  * item must be removed only when the cross mark which is icon inside button is clicked
  * if the li is clicked, but not the button part of it --> modify li
  */

  /**  in the next line ..   
   * we will first make color of all the items green.. 
   * which it was originally
   * then make the selected item red on clicking 
   * if you don't add next 2 lines after this commnent then,
   * if you will keep on selecting items then your code will not execute checkUI
   * and you will never execute the lines of prev li changing from red to green  
  */
  resetItemsClr();
 
  if (e.target.parentElement.classList.contains('remove-item')) {   // if user clicked red cross i.e. icon and it's parent is button 
    removeItem(e.target.parentElement.parentElement);               // parent of button i.e. li
  } else {                                                          // else user clicked on li but not the red cross
    // const item_prev_clr = e.target.style.color;
    e.target.style.color = "red";
    setItemToEdit(e.target);                                        // li (neither cross, nor button)
    // e.target.style.color = item_prev_clr;
  }
  console.log("end   - onClickItem")
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);  // (true or false) : check if array of item includes the item
}

/** this function do -- 
 * 1. remove "edit-mode" from all the items.. 
 *  just in case we selected li1 then li1 got "edit-mode" class
 *  now we selected li2 so li2 will also get the class, 
 *  BUT li1 still have the class "edit-mode"
 *  so we will first remove "edit-mode" class if present and after that 
 *  the current list item, we will add this class
 * 
 * 2. Add item --to--> update item
 * 3. text field to add items .. add the li textContent to that texthoder ie. itemInput.value
*/
function setItemToEdit(li_item) {
  console.log("start - setItemToEdit")
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  li_item.classList.add('edit-mode');
  /** in the prvious to prev step you removed "edit-mode" class from all item (li)
   *  in prev step you added "edit-mode" class only to the item that has to be edited
   */
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  // formBtn.style.backgroundColor = 'blue';  // i want to contol button color from css
  itemInput.value = li_item.textContent;      /* itemInput is the place holder to write item names
                                               * so we are putting the textContent of the selected li */
                                        
  // checkUI();
  console.log("end   - setItemToEdit")
}

/**removing item from DOM and storage */
function removeItem(li_item) {
    if (confirm('Are you sure?') == false) return;

    // Remove item from DOM
    li_item.remove();
    itemList.removeChild(li_item) // or you could have done this to remove from DOM 

    // Remove item from storage
    removeItemFromStorage(li_item.textContent);

    checkUI()
}

/* item parameter is textContent i.e. item name */
function removeItemFromStorage(item_name_to_be_removed) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((item_name) => item_name !== item_name_to_be_removed);

  // Re-set to localstorage : by new array (with removed item)
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

/**COPY THIS FUNCTION IN CHAT-GPT TO KNOW WHAT'S DOING ON
 * clearing all items from the list
 * by clearing the first child
 * until there no first child exists
 */
function clearItems() {
  // removing items from DOM
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  
  /**Clear from localStorage
   * Remove the data associated with the key 'items' from the web browser's localStorage. 
   * This step ensures that the cleared items are also removed from the browser's persistent storage. */
  localStorage.removeItem('items'); // elements in array with "KEY" as "ITEMS" are removed 
                                    // deleting array, so all elements deleted

  checkUI();
}

/**SEARCHING IN THE ITEMS USING FILTER BOX
 * if the text you have written in the field matches with some text
 * show that item ELSE remove that item (by hiding it, and it should not occupy space)
 * which you can achive using diplay : none
 */
function filterItems(e) {
  console.log("start - filterItems");
  checkUI(); // for removing text clr, clear the field of input, update item to add item
  
  const items = itemList.querySelectorAll('li');

  // lower case since we want to treat "HI", "hi", "Hi" equally while filtering
  const text = e.target.value.toLowerCase();      // use event.target.value to get value

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    // hiding removing list items by toggeling b/W the display properties : flex and none

    // show li if text exists in the itemName
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      // if text doesn't exists in the item then remove the item
      item.style.display = 'none';
    }
    
    console.log("end   - filterItems");
  });
}

/**CALL THE UI SO TO UPDATE THE UI AS ITEMS IN LOCAL STORAGE ARE UPDATED, INSERTED, DELETED */
function checkUI() {
  itemInput.value = ''; // to clear the field of input 
  console.log("start - checkUI");

  /**  we could have done : document.querySelectorAll('li')
   * but searching of li's in whole doc would not be optimal 
   * so we are searching only within ul i.e. itemList
  */
  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } 
  else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  // formBtn.style.backgroundColor = '#333';
  // formBtn.style.backgroundColor = "blue";  // since i want to control this from css

  resetItemsClr();

  console.log("end   - checkUI");


  // isEditMode = false; // after a task completion, showing the results, turn off isEditMode
                      // we don't try updating the li with class as "edit-mode"
                      // actually there will be the last clicked li with the class
                      // so the no new item will be added but the last clicked li will be updated
}

function resetItemsClr() {
  const all_list_items = document.body.querySelectorAll("li");
  all_list_items.forEach( item  => {item.style.color = "green"; });
}

// click in body but not at item.. otherwise clr will not change to red 
function resetItemsBody(event) {
  if (event.target.id == 'html-body') {  
    checkUI()
  }
}

// Initialize app
function init() {
  console.log("start - init");
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  htmlBody.addEventListener('click', resetItemsBody); // click in body but not at item.. otherwise clr will not change to red 

  // initially, when the web-page just loads and fetch items form local storage  
  document.addEventListener('DOMContentLoaded', displayItems);


  // window.addEventListener('click', checkUI); // update the UI if we click anywhere inside the window
  checkUI();
  console.log("end   - init");
}

init();
