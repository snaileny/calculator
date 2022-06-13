import Calculator from "./calculator.js";

const eventHandler = function(event) {

    const elem = event.target;
    const type = elem.dataset.type;
    const value = elem.dataset.value;
    
    switch(type) {

        case "input":
            Calculator.input.addTo(value);
            Calculator.input.writeToScreen();
            break;

        case "operation":
            Calculator.executeOperation(value);
            break;

        case "task":
            Calculator.executeTask(value);
            break;

    }

}

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll("button");
    Calculator.input.writeToScreen();

    buttons.forEach((button) => {

        button.addEventListener("click", eventHandler);

    });

});