// configuracion global
const CONFIG={
    API_BASE_URL:'php/',
    CURRENCY:'MXN',
    CURRENCY_SYMBOL:'$',
    ITEMNS_PER_PAGE:12,
    DEBOUNCE_DELAY:300,
    TOAST_DURATION:5000,
}
// // UTILIDADES DE FORMATO
/**
 * Formatea un número como precio en moneda mexicana
 * @param {number} price - El precio a formatear
 * @returns {string} Precio formateado
 */

function formatPrice(price){
    return new Intl.NumberFormat('es-MX',{
        style:'currency',
        currency:CONFIG.CURRENCY,
        minimumFractionDigits:2
    }).format(price);
}
/**
 * Formatea una fecha en español mexicano
 * @param {Date|string} date - La fecha a formatear
 * @returns {string} Fecha formateada
 */

function formatDate(date){
    const dateObj=typeof date ==='string'?new Date(date):date;
    return new Intl.DateTimeFormat('es-MX',{
        year:'numeric',
        month:'long',
        day:'numeric'
    }).format(dateObj);
}
/**
 * Trunca un texto a un numero especifico de caracteres
 * @param {string} text - el texto a truncar
 * @param {number} length - el numero maximo de caracteres
 * @returns {string} Texto truncado
 */
function truncateText(text,length=100){
    if(!text || text.length <= length) return text;
    return text.slice(0,length)+'...';

}

// UTILIDADES DOM
/**
 * Selecciona un elemento del DOM
 * @param {string} selector - El selector CSS del elemento
 * @param {Element} parent - El elemento padre donde buscar (opcional)
 * @returns {Element|null} El elemento seleccionado o null si no se encuentra
 */

function $(selector, parent=document){
    return parent.querySelector(selector);
}

/** 
 * Selecciona todos los elementos del DOM que coinciden con el selector
 * @param {string} selector - El selector CSS de los elementos
 * @param {Element} parent - El elemento padre donde buscar (opcional)
 * @returns {NodeList} Lista de nodos con los elementos seleccionados
 */

function $$(selector, parent=document){
    return parent.querySelectorAll(selector);
}

/** 
 * Crea un elemento del DOM con atributos y contenido opcionales
 * @param {string} tag - El nombre de la etiqueta del elemento
 * @param {Object} attributes - Un objeto con los atributos y sus valores (opcional)
 * @returns {Element} El elemento creado
 */
function createElement(tag, attributes={}){
    const element=document.createElement(tag);

    Object.entries(attributes).forEach(([key,value])=>{
        if(key ==='textContent'|| key==='innerHTML'){
            element[key]=value;
        }
        else if(key === 'className'){
            element.className=value;
        }
        else if(key === 'dataset'){
            Object.entries(value).forEach(([datakey, datavalue]) =>{
                element.dataset[datakey]=datavalue;
            });
        }
        else{
            element.setAttribute(key,value);
        }
    });
    return element;
}
/** agregar o quitar una clase en css
 * @param {Element} element - El elemento al que se le agregara o quitara la clase
 * @param {string} className - El nombre de la clase a agregar o quitar
 * @param {boolean} force - Si es true, se agrega la clase; si es false, se quita (opcional)
*/
function toggleClass(element, className, force){
    if(!element) return;
    element.classList.toggle(className, force);
}
/**
 * Muestra u oculta un elemento del DOM
 * @param {Element} element - El elemento a mostrar u ocultar
 * @param {boolean} show - Si es true, se muestra el elemento;
 */