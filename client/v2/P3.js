// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrands = [];
let favourite_brands=[];
let allproducts=[];
let numberproduct=0;
let pagesize=12;
let pageNB=1;


let page = document.querySelector('body');




// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectmaxprice=document.querySelector('#price-select');
const selectSort=document.querySelector('#sort-select');
const selectFavorite = document.querySelector('#fav-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spantotNbProducts = document.querySelector('#totnbProducts');
const spanbrands=document.querySelector('#nbBrands');
const spanP50=document.querySelector('#p50');
const spanP90=document.querySelector('#p90');
const spanP95=document.querySelector('#p95');
const spanRelease=document.querySelector('#releaseDate');
const spanNbNewProducts = document.querySelector('#nbNewProducts');




/**
 * Set global value
 * @param {Array} result - products to display
 *
 */
const setCurrentProducts = (result) => {
    currentProducts = result;
};






/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchAllProducts = async (page = 1, size = 12) => {
    try {
        const response = await fetch(
            `https://clear-fashion-gqis-3ebl6jrui-elisebrbr.vercel.app/`
        );
        const body = await response.json();
        allproducts=body;
        console.log(allproducts);


    } catch (error) {
        console.error(error);

    }
};


/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @param {String} [brand] - selected brand
 * @param {Number} [price] -selected price range
 * @param {String} [sort] -sort by date or price
 * @return {Object}
 */
const fetchProducts = async (page = pageNB, size = pagesize,brand=0,price=0,sort=0) => {
    try {
        let url=`https://clear-fashion-gqis-3ebl6jrui-elisebrbr.vercel.app/products?page=${page}&size=${size}`;

        if(brand !== 0)
        {
            url = `${url}&brand=${brand}`;
        }

        if(price !== 0)
        {
            url = `${url}&price=${price}`;
        }

        if (sort == "asc" || sort =="desc" || sort=="old" || sort=="new") {
            url = `${url}&sort=${sort}`;
        }
        const response = await fetch(
            url
        );
        const body = await response.json();
        currentProducts=body.products;
        console.log(body);
        console.log(currentProducts);
        numberproduct=body.totalProducts;

        currentPagination = {currentPage: body.currentPage, pageCount: body.totalPages};

        if (body.success !== true) {
            console.log(body);

            return { currentProducts, currentPagination };
        }

    } catch (error) {
        //console.error(error);
        return { currentProducts, currentPagination };
    }
};

/**
 * Set global value
 * @param {Array} result - products to display
 *
 */
const setCurrentBrand = (result) => {
    currentBrands = result;
}



/**
 * Fetch brands from api
 * @return {Object}
 */
const fetchbrand= async () => {
    try {
        const response = await fetch(
            `https://clear-fashion-gqis-3ebl6jrui-elisebrbr.vercel.app/brands`
        );
        const body = await response.json();

        currentBrands=body;

        if (body.success !== true) {

            return currentBrands;
        }

        return body.data;
    } catch (error) {
        //console.log(error);
        return currentBrands;
    }
};


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexWrap = 'wrap';
    div.style.justifyContent = 'center';

    const template = products
        .map(product => {
            const isFavorite = localStorage.getItem(`favorite_${product._id}`); // store favourite products on the local storage
            return `
  
      <div class="product" id=${product._id} style="text-align: center">
        
        <img  src=${product.photo} alt="Not avaible" width="200" height="220">
        <a href="${product.url}" target="_blank">${product.name}</a>
        <br>
        <span style="text-transform:uppercase" >${product.brand}</span>
        <span >Price: ${product.price}€</span>

        <br>
       
        <span>Released date: ${product.date}</span>
        <br>
        <input id="myButton${product._id}" type="button" value="Add favorite" onclick="return change(this);" /> 
       
      </div>
   
    `;
        })
        .join('');
    div.innerHTML = template;
    div.classList.add('product-container');
    fragment.appendChild(div);
    sectionProducts.innerHTML = '<h2>Products</h2>';
    sectionProducts.appendChild(fragment);
};

/**
 *
 * Function change the button onclick for favourite products
 */
function change( el )
{
    const productId = el.parentNode.getAttribute('id');
    if (el.value === 'Add favorite') {
        localStorage.setItem(`favorite_${productId}`, true);
        el.value = 'Remove favorite';
    } else {
        localStorage.removeItem(`favorite_${productId}`);
        el.value = 'Add favorite';
    }
}


/** Favourite products
 * @param  {Object} products
 */

const fav= products =>{
    return products.filter(product => localStorage.getItem(`favorite_${product._id}`));

}


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
    const {currentPage, pageCount} = pagination;
    const options = Array.from(
        {'length': pageCount},
        (value, index) => `<option value="${index + 1}">${index + 1}</option>`
    ).join('');

    selectPage.innerHTML = options;
    selectPage.selectedIndex = currentPage - 1;
};



/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
    const {count} = pagination;

}

/**
 * Render brand name (Feature 2)
 *@param  {Array} brand
 */
const renderBrands = brand => {

    const b=brand;
    const options = Array.from(b, i =>`<option value="${i}">${i}</option>`);
    selectBrand.innerHTML = options;
    spanbrands.innerHTML= (options.length) -1;

}

const render = (products, pagination) => {
    renderProducts(products);
    renderPagination(pagination);
    renderIndicators(pagination);
};

// Indicators //
/** Calculate Quatile
 *
 */

const quantile = (arr, q) => {

    const sorted=arr.sort((a, b) => a - b)
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return Math.round(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
    } else {
        return Math.round(sorted[base]);
    }
};



// Filters //

async function handleFilterChange() {
    const pageSize = parseInt(selectShow.value);
    const pageNumber = parseInt(selectPage.value);
    var brand = selectBrand.value;
    var price=selectmaxprice.value;
    var sort=selectSort.value;

    if(brand =='All brands')
    {
        brand=0;
    }

    if(price=='Select')
    {
        price=0;
    }


    if(sort =="price-asc"){
        sort= "asc";
    }

    else if(sort=="price-desc"){

        sort='desc';
    }

    else if(sort == "date-asc"){
        sort="new";
    }
    else if(sort == "date-desc"){

        sort ="old";
    }
    else if(sort=="select"){

        sort=0;
    }

    const products = await fetchProducts(pageNumber, pageSize,brand,price,sort);
    let result = products.currentProducts;
    spanNbProducts.innerHTML = numberproduct;
    setCurrentProducts(result);
    render(result, currentPagination);
}

selectShow.addEventListener('change', handleFilterChange);
selectPage.addEventListener('change', handleFilterChange);
selectBrand.addEventListener('change', handleFilterChange);
selectmaxprice.addEventListener('change',handleFilterChange);
selectSort.addEventListener('change',handleFilterChange);

// Select Favourite products //


selectFavorite.addEventListener('change',async(event)=>{

    let products ;

    if(event.target.value == "Yes"){

        products=fav(allproducts);


    }
    else if(event.target.value == "No"){

        products=currentProducts;
    }


    render(products, currentPagination);

})



// Website //

document.addEventListener('DOMContentLoaded', async () => {

    const products = await fetchAllProducts();
    const pricearray=[];

    for(let step = 0; step < allproducts.length; step++){

        pricearray.push(allproducts[step].price);

    }
    spantotNbProducts.innerHTML=allproducts.length;


    spanP50.innerHTML=quantile(pricearray,0.50);
    spanP90.innerHTML=quantile(pricearray,0.90);
    spanP95.innerHTML=quantile(pricearray,0.95);
    spanNbNewProducts.innerHTML=allproducts.filter(product=> (((new Date()- new Date (product.date)) / (1000 * 3600 * 24 )) <30) ).length;


    spanRelease.innerHTML= allproducts.sort((a,b)=> (new Date(a.date)-new Date(b.date)) ).reverse()[0].date;

    const brands = await fetchbrand();


    brands.unshift("All brands");

    const result = await fetchProducts(currentPagination.currentPage,currentPagination.count);

    const pro=result.currentProducts;

    setCurrentProducts(pro);
    setCurrentBrand(brands);

    renderBrands(brands);

    render(pro, currentPagination);

    spanNbProducts.innerHTML = numberproduct;

});





