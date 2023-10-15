const form = document.querySelector('#item-form');
const formInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const filterInput = document.querySelector('.filter');
const submitButton = document.querySelector('.btn');
const pEdit = document.querySelector('p');
let isEditMode = false;

const addItem = (e) =>{
    e.preventDefault();

    //String Validation
    if(formInput.value === ''){
        alert('Please enter an item, before submitting');
        return;
    }
    
    //Create the new list item
    const newItem = formInput.value;
    const li = document.createElement('li');
    li.textContent = newItem;
    //li.appendChild(document.createTextNode(newItem));

    const xBtn = document.createElement('button');
    xBtn.classList = 'remove-item btn-link text-red';
    
    const icon = document.createElement('i');
    icon.classList = 'fa-solid fa-xmark';
    
    xBtn.appendChild(icon);
    li.appendChild(xBtn);

    //check if we're in edit mode
    if(isEditMode){
        const oldItem = itemList.querySelector('.edit-mode');
        removeItemFromStorage(oldItem.firstChild.textContent);
        oldItem.remove();

        isEditMode = false;
    }

    //check if it will be a duplicate item
    const tempItemArray = getItemsFromStorage();
    let duplicate = false;
    tempItemArray.forEach(item =>{
        if(item == newItem){
            duplicate = true;
        }
    });
    if(duplicate){
        alert('Item is a duplicate! Please add a unique item');
        return;
    }


    itemList.appendChild(li);
    formInput.value = '';

    addItemToStorage(newItem);

    checkUI(); //Bring back clear / filter
}

const addItemToStorage = (item) =>{
    let itemArray = getItemsFromStorage();

    itemArray.push(item);
    localStorage.setItem('items', JSON.stringify(itemArray));
}

const getItemsFromStorage = () =>{
    let itemArray = localStorage.getItem('items');
    if(itemArray == null){
        itemArray = [];
    }
    else{
        itemArray = JSON.parse(itemArray);
    }

    return itemArray;
}

const removeItem = (e) =>{
    if(e.target.classList.contains('fa-xmark')){
        if(window.confirm('Are you sure you want to remove the last item?')){
            e.target.parentElement.parentElement.remove();
            checkUI();
            removeItemFromStorage(e.target.parentElement.parentElement.firstChild.textContent);
        }
    }
    else if(e.target.tagName === 'LI'){
        handleEditMode(e.target);
    }
}

const handleEditMode = (li) =>{
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((li) =>{
        li.classList.remove('edit-mode');
    })

    li.classList.add('edit-mode');
    submitButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    submitButton.style.backgroundColor = "#228B22";
    formInput.value = li.firstChild.textContent;
}

const removeItemFromStorage = (oldItem) =>{
    let itemStorage = getItemsFromStorage();
    itemStorage = itemStorage.filter(item => (item != oldItem));

    localStorage.setItem('items', JSON.stringify(itemStorage));
}

const clearList = (e) =>{
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }

    localStorage.removeItem('items');
    checkUI();
}

const checkUI = () =>{
    const items = itemList.querySelectorAll('li');
    if(items.length === 0){
        clearBtn.style.display = 'none';
        filterInput.style.display = 'none';
        pEdit.style.display = 'none';
    }
    else{
        clearBtn.style.display = 'block';
        filterInput.style.display = 'block';
        pEdit.style.display = 'block';
    }

    submitButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    submitButton.style.backgroundColor = "#333";
    formInput.value = '';

    isEditMode = false;
}

const filterList = (e) =>{
    const currentWord = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');
    items.forEach((item) =>{
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.includes(currentWord)){
            item.style.display = 'flex';
        }
        else{
            item.style.display = 'none';
        }
    })

}

const displayItems = () =>{
    const storageItems = getItemsFromStorage();

    for(item of storageItems){
        const li = document.createElement('li');
        li.textContent = item;

        const xBtn = document.createElement('button');
        xBtn.classList = 'remove-item btn-link text-red';
        
        const icon = document.createElement('i');
        icon.classList = 'fa-solid fa-xmark';
        
        xBtn.appendChild(icon);
        li.appendChild(xBtn);

        itemList.appendChild(li);
    }
    checkUI();
}


//Event Listeners
form.addEventListener('submit', addItem);
itemList.addEventListener('click', removeItem);
clearBtn.addEventListener('click', clearList);
filterInput.addEventListener('input', filterList);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI();