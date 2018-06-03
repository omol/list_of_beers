//JSLint settings
/*jslint
    this,
    browser: true*/ /*global  $,
    alert
*/
$(document).ready(function () {
    'use strict';
    var beers;
    var asc = true;
    var beerSearch = $('#beerSearch');

    // Get list of beers
    function getBeersList() {
        $.ajax({
            url: "https://api.punkapi.com/v2/beers",
            data: {},
            type: "GET"
        }).done(function (res) {
            beers = res;
            $('#beer-table tbody tr').remove();
            // JSLint introduces a new reserved word: ignore. It is used in parameter lists and in catch clauses to indicate a parameter that will be ignored. Unused warnings will not be produced for ignore.
            $.each(beers, function (ignore, beer) {
                $('#beer-table tbody').append($('<tr id="product_' + beer.id + '" class="product" data-name="' + beer.name + '" data-descr="' + beer.description + '"><td>' + beer.id + '</td><td>' + beer.name + '</td><td>' + beer.tagline + '</td><td>' + beer.ibu + '</td><td>' + beer.abv + '</td></tr>'));
            });
        }).fail(function () {
            alert("error!");
        });
    }
    getBeersList();

    //Table sorting asc and desc
    function sortTable(table, order, column) {
        var tbody = table.find('tbody');

        tbody.find('tr').sort(function (a, b) {
            if (order === true) {
                return $('td:nth-of-type(' + column + ')', a).text().localeCompare($('td:nth-of-type( ' + column + ')', b).text(), false, {numeric: true});
            } else {
                return $('td:nth-of-type( ' + column + ' )', b).text().localeCompare($('td:nth-of-type( ' + column + ' )', a).text(), false, {numeric: true});
            }
        }).appendTo(tbody);
    }
    //Sort on click event listener
    $('i').click(function () {
        asc = !asc;
        var column = $(this).parent().attr('data-column');
        sortTable($('#beer-table'), asc, column);
    });

    //Filter by name
    function filterBeers(prefix) {
        return beers.filter(function (el) {
            var regexp = new RegExp(prefix, 'gi');
            return el.name.match(regexp);
        });
    }

    //Show matching beer names
    function showSuggestions() {
        $('#beer-table tbody tr').remove();
        if (beerSearch.val().length > 0) {
            var matchedBeers = filterBeers(beerSearch.val());
            if (matchedBeers.length > 0) {
                matchedBeers.slice(0, matchedBeers.length).map(function (el) {
                    $('#beer-table tbody').append($('<tr id="product_' + el.id + '" class="product"><td>' + el.id + '</td><td>' + el.name + '</td><td>' + el.tagline + '</td><td>' + el.ibu + '</td><td>' + el.abv + '</td></tr>'));
                });
            } else {
                $('#beer-table tbody tr').remove();
                $('#beer-table tbody').append($('<tr><td colspan="5">No matches found</td></tr>'));
            }
        } else if (beerSearch.val().length === 0) {
            getBeersList();
        }
    }

    //Filter event listeners
    beerSearch.change(showSuggestions);
    beerSearch.keyup(showSuggestions);

    //Open & fill in modal data
    $('body').on('click', '.product', function () {
        $('img').remove();
        var img = new Image();
        var product = $(this)[0];
        var currentBeer = beers.find(function (el) {
            return 'product_' + el.id === product.id;
        });
        var productName = currentBeer.name;
        var ibu = currentBeer.ibu;
        var abv = currentBeer.abv;
        var productDescription = currentBeer.description;
        img.src = currentBeer.image_url;
        $('#imgWrapper').prepend(img);
        $('#productDialog').modal('show');
        $('#productDialogTitle').html(productName);
        $('#productDialogDescr').html(productDescription);
        $('#ibu').html(ibu);
        $('#abv').html(abv);
    });
});

