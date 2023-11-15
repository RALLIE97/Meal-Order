// Function to prompt the user for their main ingredient and place an order
function takeOrder() {
    let mainIngredient = prompt("Enter the main ingredient for your meal:");

    // Convert the main ingredient to lowercase and replace spaces with underscores
    let formattedIngredient = mainIngredient.toLowerCase().replace(/ /g, '_');

    // Call the Meal DB API to get meals based on the main ingredient
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${formattedIngredient}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals !== null && data.meals.length > 0) {
                // Randomly select a chef's favourite meal
                let randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];

                // Create an order
                let order = {
                    description: randomMeal.strMeal,
                    orderNumber: getOrderNumber(),
                    completionStatus: "incomplete"
                };

                // Store the order in sessionStorage
                storeOrder(order);

                alert(`Order placed! Your order number is ${order.orderNumber}.`);

                // Display and complete orders after placing an order
                displayAndCompleteOrders();
            } else {
                alert("No meals found for the specified ingredient. Please try again.");
                takeOrder(); // Retry with a new ingredient
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}

// Function to store an order in sessionStorage
function storeOrder(order) {
    let orders = JSON.parse(sessionStorage.getItem("orders")) || [];
    orders.push(order);
    sessionStorage.setItem("orders", JSON.stringify(orders));
    sessionStorage.setItem("lastOrderNumber", order.orderNumber);
}

// Function to get the last order number
function getOrderNumber() {
    return parseInt(sessionStorage.getItem("lastOrderNumber")) + 1 || 1;
}

// Function to display and complete orders
function displayAndCompleteOrders() {
    let incompleteOrders = JSON.parse(sessionStorage.getItem("orders")) || [];

    if (incompleteOrders.length > 0) {
        let ordersString = "Incomplete Orders:\n";
        incompleteOrders.forEach(order => {
            ordersString += `Order Number: ${order.orderNumber} - Description: ${order.description}\n`;
        });

        let orderNumberToComplete = parseInt(prompt(ordersString + "Enter the order number to mark as complete (or enter 0 to cancel):"));

        if (orderNumberToComplete !== 0) {
            let orderToComplete = incompleteOrders.find(order => order.orderNumber === orderNumberToComplete);

            if (orderToComplete) {
                orderToComplete.completionStatus = "complete";
                moveOrderToCompleted(orderToComplete);
                alert(`Order ${orderNumberToComplete} marked as complete.`);
            } else {
                alert("Invalid order number. Please try again.");
                displayAndCompleteOrders();
            }
        }
    } else {
        alert("No incomplete orders to display.");
    }
}

// Function to move an order to the completed orders list
function moveOrderToCompleted(order) {
    let completedOrders = JSON.parse(sessionStorage.getItem("completedOrders")) || [];
    completedOrders.push(order);
    sessionStorage.setItem("completedOrders", JSON.stringify(completedOrders));

    // Remove the completed order from the incomplete orders list
    let incompleteOrders = JSON.parse(sessionStorage.getItem("orders")) || [];
    let updatedIncompleteOrders = incompleteOrders.filter(o => o.orderNumber !== order.orderNumber);
    sessionStorage.setItem("orders", JSON.stringify(updatedIncompleteOrders));
}

// Function to display completed orders
function displayCompletedOrders() {
    let completedOrders = JSON.parse(sessionStorage.getItem("completedOrders")) || [];

    if (completedOrders.length > 0) {
        let ordersString = "Completed Orders:\n";
        completedOrders.forEach(order => {
            ordersString += `Order Number: ${order.orderNumber} - Description: ${order.description}\n`;
        });

        alert(ordersString);
    } else {
        alert("No completed orders to display.");
    }
}

