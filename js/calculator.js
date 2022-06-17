export default class Calculator {

    static input = {

        valueStr: "0",
        maxLength: 18,
        roundValue: "round-float",
        received: false,
        outputElement: document.querySelector("#output"),
        roundElement: document.querySelector('button[data-type="round"]'),

        getStr() {return this.valueStr},
        getNum() {return parseFloat(this.valueStr)},
        set(input) {

            const inputStr = String(input);
            this.valueStr = inputStr.slice(0, this.maxLength + 1);
                
        },
        addTo(str) {

            const filteredInput = this.valueStr
                .split("")
                .filter((el) => {if (el !== "-" && el !== ".") {return el;}})
                .join("");
            
            if (filteredInput.length < this.maxLength || this.received === false) {

                if (str === "." && !this.valueStr.includes(".")) {

                    this.valueStr += str;

                } else if (str !== ".") {

                    if (this.valueStr === "0" || this.received === false) {

                        this.valueStr = str;

                    } else {

                        this.valueStr += str;

                    }

                }

            }

            this.received = true;

        },
        parse() {

            const inputNum = this.getNum();
            const inputStr = this.valueStr;
            const dotIndex = inputStr.indexOf(".");
            const slicedInput = inputStr.slice(0, dotIndex + 3);

            if (this.roundValue === "round-off" && dotIndex !== -1) {
                
                this.valueStr = inputNum.toFixed(2);

            } else if (this.roundValue === "round-cut") {

                this.valueStr = slicedInput;

            }

        },
        writeToScreen(parse = false) {

            if (parse === true) {

                Calculator.input.parse();
                this.outputElement.textContent = Calculator.input.getStr();
 
            } else {

                this.outputElement.textContent = Calculator.input.getStr();

            }
             
        }
        
    };

    static tasks = {

        root() {

            Calculator.input.set(Math.sqrt(Calculator.input.getNum()));
            Calculator.input.writeToScreen(true);

        },
        changeSign() {

            Calculator.input.set(Calculator.input.getNum() * -1);
            Calculator.input.writeToScreen(true);

        },
        clear() {

            Calculator.input.set("0");
            Calculator.input.received = false;
            Calculator.input.writeToScreen();

        },
        allClear() {

            Calculator.input.set("0");
            Calculator.input.received = false;
            Calculator.memory.clear();
            Calculator.register.resetAll();
            Calculator.input.writeToScreen();

        },
        backspace() {

            const input = Calculator.input.getStr();
            const trimValue = (input[input.length - 2] === ".") ? 2 : 1;
            
            if (input !== "0") {

                const trimmedInput = input.slice(0, input.length - trimValue);

                if (trimmedInput.length > 0) {

                    Calculator.input.set(trimmedInput);

                } else {

                    Calculator.input.set("0");

                }

            }

            Calculator.input.writeToScreen(true);

        },
        round() {

            if (Calculator.input.roundValue === "round-float") {

                Calculator.input.roundValue = "round-off";
                Calculator.input.roundElement.textContent = "5/4"

            } else if (Calculator.input.roundValue === "round-off") {

                Calculator.input.roundValue = "round-cut";
                Calculator.input.roundElement.textContent = "CUT"

            } else {

                Calculator.input.roundValue = "round-float";
                Calculator.input.roundElement.textContent = "F"

            }

        }

    }

    static memory = {

        value: 0,

        recall() {

            Calculator.input.set(this.value);
            Calculator.input.writeToScreen();

        },
        clear() {this.value = 0},
        add() {this.value += Calculator.input.getNum()},
        sub() {this.value -= Calculator.input.getNum()}

    }

    static operations = {

        add(x, y) {return x + y},
        subtract(x, y) {return y - x},
        multiply(x, y) {return x * y},
        divide(x, y) {return y / x},
        percentage(x, y) {return (y / 100) * x}

    }

    static register = {

        x: 0,
        y: 0,
        status: "",
        state: 0,

        setNumber(num) {

            if (this.state === 0) {

                this.x = num;
                this.state = 1;

            } else {

                this.y = this.x;
                this.x = num;
                this.state = 0;

            }

        },
        setStatus(operation) {this.status = operation;},
        setResult(num) {this.result = num},
        resetNum() {

            this.state = 0;
            this.x = 0;
            this.y = 0;

        },
        resetAll() {

            this.state = 0;
            this.status = "";
            this.x = 0;
            this.y = 0;

        }

    }

    static executeOperation(operation) {

        if (this.register.state === 0) {

            if (operation !== "equal") {

                this.register.setStatus(operation);

                const num = this.input.getNum()
                this.register.setNumber(num);
    
                this.input.received = false;
                this.input.writeToScreen();

            }

        } else if (this.register.state === 1) {

            if (operation !== "equal") {

                this.register.setStatus(operation);

                if (this.input.received === true) { 

                    const num = this.input.getNum();
                    this.register.setNumber(num);

                    const result = this.calculate();
                    this.register.resetNum();
                    this.register.setNumber(result);

                    this.input.set(result);
                    this.input.received = false;
                    this.input.writeToScreen(true);

                }

            } else if (operation === "equal") {

                if (this.input.received === true || this.register.status === "mul" || this.register.status === "div") {

                    const num = this.input.getNum();
                    this.register.setNumber(num);

                    const result = this.calculate();
                    this.register.resetAll();
    
                    this.input.set(result);
                    this.input.received = false;
                    this.input.writeToScreen(true);
    
                } 

            }
            
        }

    }

    static executeTask(task) {

        switch(task) {

            case "equal":
                this.tasks.equal();
                break;

            case "root":
                this.tasks.root();
                break;

            case "changeSign":
                this.tasks.changeSign();
                break;

            case "clear":
                this.tasks.clear();
                break;

            case "allClear":
                this.tasks.allClear();
                break;

            case "backspace":
                this.tasks.backspace();
                break;

            case "round":
                this.tasks.round();
                break;

            case "memoryRecall":
                this.memory.recall();
                break;

            case "memoryClear":
                this.memory.clear();
                break;

            case "memoryAdd":
                this.memory.add();
                break;
                
            case "memorySubtract":
                this.memory.sub();
                break;

        }

    }

    static calculate(x = this.register.x, y = this.register.y, operation = this.register.status) {

        switch(operation) {

            case "add":
                return this.operations.add(x, y);
            
            case "subtract":
                return this.operations.subtract(x, y);

            case "multiply":
                return this.operations.multiply(x, y);

            case "divide":
                return this.operations.divide(x, y);

            case "percentage":
                return this.operations.percentage(x, y);

            default:
                return 0;

        }

    }

}