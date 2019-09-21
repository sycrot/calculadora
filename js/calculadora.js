var num1, num2, operacao, estado;
var tela;

function reset() { //leva a calculador para o estado inicial
    num1 = "0";
    num2 = "0";
    operacao = null;
    estado = 1;
    tela.value = "0";
}

function btnClick(obj) {
    var val = obj.value;

    if(val == 'C') {
        reset();
        return;
    }

    if(val == '='){
        var res;

        switch (operacao) {
            case '+':
                res = parseFloat(num1) + parseFloat(num2);
                break;
            case 'X':
                res = parseFloat(num1) * parseFloat(num2);
                break;
            case '/':
                res = parseFloar(num1) / parseFloat(num2);
                break;
            case '-':
                res = parseFloat(num1) - parseFloat(num2);
                break;
        }

        tela.value = res.toString();
        estado = 1;
        return;
    }

    if((val == '+') || (val == '-') || (val == 'X') || (val == '/')){
        operacao = val;
        estado = 2;
        return;
    }

    if((val == '.') || (val >= '0') && (val <= '9')) {
        if(estado == 1){
            num1 += val;
            tela.value = parseFloat(num1).toString();
        }else if(estado == 2) {
            num2 += val;
            tela.value = parseFloat(num1).toString();
        }
    }
}

function inicializa() { //inicializa a calculadora
    tela = document.getElementById('display');
    reset();
}