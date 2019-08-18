//DATA CONTROLLER
var dataController = (function() {
	//function constructor for multiple todo list items
	var Todo = function(id, description) {
		this.id = id;
		this.description = description;
	};

	//data structure for storing data about todo list items
	var data = {
		allItems: []
	};

	//local data for other modules
	return {
		addItem: function(description) {
			var newItem, ID;

			//logic for id
			if (data.allItems.length > 0) {
				ID = data.allItems[data.allItems.length - 1].id + 1;
			} else {
				ID = 0;
			}

			//logic for new item
			newItem = new Todo(ID, description);

			//adding new item to the data structure
			data.allItems.push(newItem);

			//making new item local
			return newItem;
		},

		// for deleting item from data structure
		deleteItem: function(description, id) {
			var ids, index;

			ids = data.allItems.map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems.splice(index, 1);
			}
		},
		testing: function() {
			console.log(data);
		}
	};
})();

//UI CONTROLLER

var uiController = (function() {
	return {
		getInput: function() {
			return {
				description: document.querySelector('.add__description').value
			};
		},

		//function for adding list item to the ui
		addItemList: function(obj) {
			var html, newHtml;
			//create html string with placeholder
			html =
				'<div class="item clearfix" id="description-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			//replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);

			//insert HTML into the DOM
			document
				.querySelector('.description__list')
				.insertAdjacentHTML('beforeend', newHtml);
		},

		//function for clearing the input fields
		clearFields: function() {
			var fields, fieldsArray;

			//selection various input fields
			fields = document.querySelectorAll('.add__description');

			//converting list to an array
			fieldsArray = Array.prototype.slice.call(fields);

			//empty the value fields after end of a list
			fieldsArray.forEach(function(current, index, array) {
				current.value = '';
			});
			fieldsArray[0].focus();
		}
	};
})();

//CONTROLLER

//creating an initializ
var controller = (function(dtCtrl, uiCtrl) {
	//function for event listeners
	var setUpEventListeners = function() {
		//adding event listener

		document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', function(e) {
			if (e.keyCode === 13 || e.which === 13) {
				ctrlAddItem();
			}
		});

		//for delete item event
		document
			.querySelector('.container')
			.addEventListener('click', ctrlDeleteItem);
	};
	var ctrlAddItem = function() {
		//1 get the field  input data from ui controller
		var inputFromUI = uiCtrl.getInput();

		// logic for preventing false input
		if (inputFromUI.description !== '') {
			//2 add item to the data controller module
			var newItemD = dtCtrl.addItem(inputFromUI.description);

			//3 add same items to the ui
			uiCtrl.addItemList(newItemD, inputFromUI);

			//4 clear fields of input fields and focus on first input field
			uiCtrl.clearFields();
		}
	};

	//delete item function
	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, Id;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.Id;

		//LOGIC FOR DELETING ITEM BY ID ON CONTAINER FIELD
		if (itemID) {
			//split id
			splitID = itemID.split('-');
			Id = parseInt(splitID[1]);

			// delete item
			dtCtrl.deleteItem(Id);
		}
	};
	return {
		inIt: function() {
			console.log('application has started');
			setUpEventListeners();
		}
	};
})(dataController, uiController);

// for initializing of the setUpEventListeners
controller.inIt();
