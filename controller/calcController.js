class CalcController {

    constructor() {

        this._audio = new Audio('assets/sound/click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber =  '';

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#conta");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    // colar o numero/texto na calculadora
    pasteFronClipboard() {

        document.addEventListener('paste', e=> {

            let text = e.clipboardData.getData('Text');

            this.displayCalcEl = parseFloat(text);


        })

    }

    initialize() {

        this.setDisplayDateTime();

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFronClipboard();

        document.querySelectorAll('#btnClear').forEach(btn=> {

            btn.addEventListener('dblclick', e=> {

                this.toggleAudio();

            });

        });

    }

    // liga o som ou desliga
    toggleAudio() {

        this._audioOnOff = !this._audioOnOff;

    }

    // dá o play no áudio
    playAudio() {

        if( this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }


    // método para acionar eventos do teclado
    initKeyboard() {

        document.addEventListener('keyup', e=>{

            this.playAudio();

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '%':
                case '*':
                case '/':
                case '+':
                case '-':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
    
                
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

    
    
            }
    

        });

    }

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn);

        });

    }

    // limpa tudo
    clearAll() {

        this._operation = [];
        this._lastNumber =  '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();

    }

    // limpa a entrada
    clearEntry() {

        this._operation.pop();
        this.setLastNumberToDisplay();

    }

    getLastOperation() {

        return this._operation[this._operation.length - 1];

    }

    setLastOperation(value) {

        this._operation[this._operation.length -1 ] = value;

    }

    // verifica se é um operador
    isOperator(value) {

        return (['+', '-', '*', '/', '%'].indexOf(value) > - 1);

    }

    //
    pushOperation(value) {

        this._operation.push(value);

        if(this._operation.length > 3) {

            this.calc();

        }

    }

    getResult() {

        try {
            return eval(this._operation.join(""));
        } catch(e) {
            setTimeout(()=> {
                this.setError();
            }, 1);
            
        }

    }

    calc() {

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if(this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if(last == '%') {

             result /= 100;
            
             this._operation = [result];

        } else {

            this._operation = [result];

            if(last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length-1; i >= 0; i--) {

            
            if(this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
            

        }

        if(!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }

    // atualiza display
    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalcEl = lastNumber;

    }

    // adiciona numeros no array
    addOperation(value) {

        if (isNaN(this.getLastOperation())) { // se for string

            if (this.isOperator(value)) { //trocar operador

                this.setLastOperation(value);

            } else {

                this.pushOperation(value);

                this.setLastNumberToDisplay();

            }

        } else { // se for numero

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else { 

                let newValue = this.getLastOperation().toString()+value.toString();
                this.setLastOperation(newValue);

                //atualiza display
                this.setLastNumberToDisplay();

            }

        }


    }

    setError(){

        this.displayCalcEl = "error";

    }

    // método para o botão '.'
    addDot() {

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation) {

            this.pushOperation('0.');

        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

    }

    // execução de cada botão
    execBtn(value) {

        this.playAudio();

        switch (value) {

            case 'AC':
                this.clearAll();
                break;
            case 'CE':
                this.clearEntry();
                break;
            case '%':
                this.addOperation('%');
                break;
            case 'X':
                this.addOperation('*');
                break;
            case '/':
                this.addOperation('/');
                break;
            case '+':
                this.addOperation('+');
                break;
            case '-':
                this.addOperation('-');
                break;
            case '=':
                this.calc();
                break;
            case '.':
            case ',':
                this.addDot();
                break;

            
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;


        }

    }

    // eventos do botão
    initButtonsEvents() {

        let buttons = document.querySelectorAll("#buttons > input");

        buttons.forEach((btn, index) =>{

            this.addEventListenerAll(btn, "click drag", e => {

                let textBtn = btn.value;

                this.execBtn(textBtn);

            });

            this.addEventListenerAll(btn, "mouseover mouseup, mousedown", e => {

                btn.style.cursor = "pointer";

            })

        });

    }

    // método para mostrar data e hora no display
    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    //Getters e setters
    get displayTime() {
        return this._timeEl.innerHTML;
    }
    set displayTime(val) {
        this._timeEl.innerHTML = val;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }
    set displayDate(val) {
        this._dateEl.innerHTML = val;
    }

    get displayCalcEl() {
        return this._displayCalcEl.innerHTML;
    }
    set displayCalcEl(val) {

        if(val.toString().length > 10) {
            this.setError();
            alert("A calculadora não suporta mais de 10 caracteres");
            return false;
        }

        this._displayCalcEl.innerHTML = val;
    }

    get currentDate() {
        return new Date();
    }
    set currentDate(date) {
        this._currentDate = date;
    }
    // fim getters e setters

}