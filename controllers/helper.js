let helper = {};

helper.createStarList = (stars) => {
    let str = `<ul class="list">
    <li><a href="#">5 Star <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i
             class="fa fa-star"></i><i class="fa fa-star"></i> ${stars[4]}</a></li>
    <li><a href="#">4 Star <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i
             class="fa fa-star"></i><i class="fa fa-star disabled"></i> ${stars[3]}</a></li>
    <li><a href="#">3 Star <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i
             class="fa fa-star disabled"></i><i class="fa fa-star disabled"></i> ${stars[2]}</a></li>
    <li><a href="#">2 Star <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star disabled"></i><i
             class="fa fa-star disabled"></i><i class="fa fa-star disabled"></i> ${stars[1]}</a></li>
    <li><a href="#">1 Star <i class="fa fa-star"></i><i class="fa fa-star disabled"></i><i class="fa fa-star disabled"></i><i
             class="fa fa-star disabled"></i><i class="fa fa-star disabled"></i> ${stars[0]}</a></li>
</ul>`

    return str;
}

helper.createStars = (star) => {
    let str = ``;
    let i;
    for (i = 1; i <= star; i++) {
        str += `<i class="fa fa-star"></i>`;
    }
    for (; i <= 5; i++) {
        str += `<i class="fa fa-star disabled"></i>`;
    }
    return str;
}

helper.createTopProductList = (topProducts) => {
    let str = '';
    let count = 0;
    const length = topProducts? topProducts.length: 0;
    for (let i = 0; i < length; i++) {
        count++;
        if (i % 3 === 0) {
            str += `<div class="col-sm-6 col-xl-3 mb-4 mb-xl-0">
            <div class="single-search-product-wrapper">`;
        }

        str += `<div class="single-search-product d-flex">
<a href="/products/${topProducts[i].id}"><img src="${topProducts[i].imagepath}" alt=""></a>
<div class="desc">
    <a href="/products/${topProducts[i].id}" class="title">${topProducts[i].name}</a>
    <div class="price">$${topProducts[i].price}</div>
</div>
</div>`
        if (count === 3) {
            str += `</div></div>`;
            count = 0;
        }
    }

    return str;
}

module.exports = helper;