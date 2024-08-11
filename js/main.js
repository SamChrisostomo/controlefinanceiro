import Weather from "./weather.js";

const materialRender = createMaterialRender();

function createMaterialRender() {
    document.addEventListener("DOMContentLoaded", materialInit, false);

    const sidenav = document.querySelectorAll('.sidenav');
    const selectElement = document.querySelectorAll('select');
    const tabs = document.querySelectorAll('.tabs');

    function autocompleteFunction(data) {
        const autocomplete = document.querySelector('.autocomplete');
        autocomplete.addEventListener(
            'focus',
            (e) => {
                M.Autocomplete.init(e.target, {
                    data: data
                });
            }
        )
    }

    function materialInit() {
        M.Tabs.init(tabs, {
            duration: 500
        });

        M.FormSelect.init(selectElement);

        M.Sidenav.init(sidenav);
    }

    return {
        autocompleteFunction
    }
}

const createElement = createNewElement();

function createNewElement() {
    const tableBody = document.querySelector('tbody');

    function element(dataObj) {
        tableBody.innerHTML += `
         <tr>
            <td>${dataObj.data}</td>
            <td>${dataObj.descricao}</td>
            <td>${dataObj.autocomplete_categoria}</td>
            <td>R$ ${dataObj.valor}</td>
        </tr>
    `
    }

    return {
        element
    }
}

const orders = createOrders();
orders.start();

function createOrders() {
    const itens = JSON.parse(localStorage.getItem('orders')) || [];

    function start() {
        itens.forEach(element => {
            createElement.element(element)
        });
    }

    function update(data) {
        const existe = itens.find((elem) => {
            if (elem.descricao === data.descricao && elem.data === data.data) {
                return true;
            }
            return false;
        });

        if (existe) {
            data.id = existe.id;
            itens[itens.findIndex(elem => elem.id === existe.id)] = data;
        } else {
            data.id = itens[itens.length - 1] ? (itens[itens.length - 1]).id + 1 : 0;
            itens.push(data);
        }

        localStorage.setItem('orders', JSON.stringify(itens));
    }

    return {
        start,
        update
    }
}

const modalListener = createModalListener();

function createModalListener() {
    //Listeners
    document.addEventListener('DOMContentLoaded', modal, false);

    function modal() {

        const modal = document.querySelectorAll('.modal');

        M.Modal.init(modal, {
            opacity: 0.2,
            onCloseEnd: () => M.toast({
                html: 'Operação Cancelada!',
                displayLength: 3000
            }),
            dismissible: false
        });
    }
}

const submitListener = createOrderSubmitListener();
submitListener.subscribe(orders.update);
submitListener.subscribe(createElement.element);

function createOrderSubmitListener() {
    const state = {
        observers: []
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function notifyAll(dataObj) {
        console.info(`Notificando ${state.observers.length} observerss`);
        for (const observerFunction of state.observers) {
            observerFunction(dataObj)
        }
    }

    const form = document.querySelector('#submit-order');
    form.addEventListener('submit', orderSubmit, false);

    function orderSubmit(event) {
        event.preventDefault();

        const data = event.target.elements['data-transacao'];
        const valor = event.target.elements['valor-transacao'];
        const descricao = event.target.elements['descricao'];
        const movimentacao = event.target.elements['movimentacao'];
        const autocomplete_categoria = event.target.elements['autocomplete-categoria'];
        const forma_pagamento = event.target.elements['forma-pagamento'];

        const dataObj = {
            data: data.value,
            valor: valor.value,
            descricao: descricao.value,
            movimentacao: movimentacao.value,
            autocomplete_categoria: autocomplete_categoria.value,
            forma_pagamento: forma_pagamento.value
        }

        notifyAll(dataObj);
    }

    return {
        subscribe
    }
}

const category = createCategory();
category.start();

function createCategory() {
    const state = {
        'Moto': null,
        'Carro': null,
        'Saude': null,
        'Celular': null,
        'Salário': null,
        'Lanche': null,
        'Nubank': null,
        'C6 Bank': null,
        'Transporte': null,
        'Eletrônicos': null,
        'Banco Inter': null,
        'Combustível': null,
        'Alimentação': null,
        'Adiantamento': null,
        'Estacionamento': null,
    }

    const categoriaObj = JSON.parse(localStorage.getItem('categorias'));

    function start() {
        if (categoriaObj === null) {
            localStorage.setItem('categorias', JSON.stringify(state));
        }

        materialRender.autocompleteFunction(categoriaObj);
    }

    function update(data) {
        const valido = typeof (data);

        if (valido === "object") {
            const updateLocalStorage = Object.assign(categoriaObj, state, data);
            localStorage.setItem('categorias', JSON.stringify(updateLocalStorage));
        }
    }

    return {
        start,
        update
    }
}
const catSubmit = createCatSubmitListener();
catSubmit.subscribe(category.update);

function createCatSubmitListener() {
    const state = {
        observers: []
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function notifyAll(dataObj) {
        console.info(`Notificando ${state.observers.length} observerss`);
        for (const observerFunction of state.observers) {
            observerFunction(dataObj)
        }
    }
    
    const form = document.querySelector('#catSubmitForm');
    form.addEventListener('submit', catSubmitFunction, false);
    
    function catSubmitFunction(event) {
        event.preventDefault();
        const categoria = event.target.elements['nova-categoria'].value;

        const dataObj = {}
        dataObj[categoria] = null;

        console.info(dataObj)
        notifyAll(dataObj)
    }

    return {
        subscribe
    }
}

(function call() {
    const w = new Weather();
    w.getLocation();
})()