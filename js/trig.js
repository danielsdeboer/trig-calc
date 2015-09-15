function calcSideA(b,c) {
    // Calculate side b when side a and side c are known
    return Math.sqrt( Math.pow(c, 2) - Math.pow(b, 2) );
}

function calcSideB(a,c) {
    // Calculate side b when side a and side c are known
    return Math.sqrt( Math.pow(c, 2) - Math.pow(a, 2) );
}

function calcSideC(a,b) {
    // Calculate side c when side a and side b are known
    return Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
}

function degToRad(n) {
    // Convert degrees to radians; Math deals with rads only
    return n * Math.PI/180;
}

function calcOppositeWithAdjacent(y, a) {
    // Calculate the opposide side from an angle + the adjacent side
    return  (Math.tan(degToRad(y)) * a);
}

function calcAdjacentWithOpposite(y, b) {
    // Calculate the adjacent side from an angle + the opposite side
    //
    // Javascript doesn't have a cotangent function, we just play
    // musical chairs until we have an adjacent angle instead.
    var z = 90 - y;
    return  calcOppositeWithAdjacent(z, b);
}

function getSides() {
    $('#a').val() > 0 ? a = parseFloat( $('#a').val() ) : a = null;
    $('#b').val() > 0 ? b = parseFloat( $('#b').val() ): b = null;
    $('#c').val() > 0 ? c = parseFloat( $('#c').val() ): c = null;
}

function getAngles() {
    $('#y').val() > 0 ? y = parseFloat( $('#y').val() ) : y = null;
    $('#z').val() > 0 ? z = parseFloat( $('#z').val() ) : z = null;
}

function getDiameters() {
    $('#d').val() > 0 ? d = parseFloat( $('#d').val() ) : d = null;
    $('#e').val() > 0 ? e = parseFloat( $('#e').val() ): e = null;
}

function getAll() {
    getSides();
    getAngles();
    getDiameters();
}

function roundToTen(n) {
    return +(Math.round(n + 'e+10') + 'e-10');
}

$(document).ready(function () {
    // Re-evaluate everything on blur, click, or change.
    $('input').on('blur click change', function() {
        
        getAll();

        // Things to do with A/B/C validations
        // This needs a switch or it gets too complicated with if/else, etc
        switch(true) {
            case (a > 0 && b > 0):
                $('#c').prop('disabled', true);
                break;

            case (b > 0 && c > 0):
                $('#a').prop('disabled', true);
                break;

            case (c > 0 && a > 0):
                $('#b').prop('disabled', true);
                break;

            case ( (a === null && b === null) || (a === null && c === null) || (b === null && c === null) ):
                $('#a').prop('disabled', false);
                $('#b').prop('disabled', false);
                $('#c').prop('disabled', false);
                break;

            default:
                $('#a').prop('disabled', false);
                $('#b').prop('disabled', false);
                $('#c').prop('disabled', false);
                break;
        }

        // Switch between Ok and Warning depending on state
        switch (true) {

            case (y >= 90 || z >= 90):
                $('#trig-icon').empty().append('error');
                $('#trig-message').empty().append('Try making a triangle that conforms to reality.');
                $('.trig-meta').removeClass('bg-grey bg-green').addClass('bg-red');
                break;

            case (y > 0 && z > 0 && y + z !== 90):
                console.log(y + z);
                $('#trig-icon').empty().append('error');
                $('#trig-message').empty().append('Sum of angles must equal 180&deg;.');
                $('.trig-meta').removeClass('bg-grey bg-green').addClass('bg-red');
                break;

            case (  (a > 0 && b > 0) ||
                    (a > 0 && c > 0) ||
                    (b > 0 && c > 0) ||
                    ( 
                        (a > 0 || b > 0 || c> 0 ) &&
                        (y > 0 || z > 0)
                    )):
                $('#trig-icon').empty().append('check_circle');
                $('#trig-message').empty().append('OK to calculate.');
                $('.trig-meta').removeClass('bg-grey bg-red').addClass('bg-green');
                break

            case (d > 0 && e > 0):
                $('#trig-icon').empty().append('error');
                $('#trig-message').empty().append('Fill in D or E but not both.');
                $('.trig-meta').removeClass('bg-grey bg-green').addClass('bg-red');
                break;

            default:
                $('#trig-icon').empty().append('help');
                $('#trig-message').empty().append('Needs more info. Input at least 1 angle and 1 side.');
                $('.trig-meta').removeClass('bg-green bg-red').addClass('bg-grey');
        }
    });

    // Calculate things on button click
    $('#trig-calculate').click(function (event) {
        // Stop the button from actually submitting anything
        event.preventDefault();
    
        // Re-evaluate the vars that may have been changed
        // Variables for side lengths
        getSides();
        getAngles();

        // If two sides are set, we can find all the values automatically
        switch(true) {
            case (a > 0 && b > 0):
                $('#c').prop('value', calcSideC(a,b));
                break;

            case (a > 0 && c > 0):
                $('#b').prop('value', calcSideB(a,c));
                break;

            case (b > 0 && c > 0):
                $('#a').prop('value', calcSideA(b,c));
                break;
        }

        // Then find the angles
        switch(true) {
            case (a > 0 && b > 0 && c > 0):
                // Update y
                $('#y').prop('value', function() {
                    return roundToTen( Math.asin((a / c)) * (180/Math.PI) );
                });
                // Update z
                $('#z').prop('value', function() {
                    return roundToTen( Math.asin(b / c) * (180/Math.PI) );
                });
                break;
        }

        // But what if we know 1 side and 1 angle? Then we have to do something different.
        switch(true) {

            // If we know y & a
            case    (
                        (a > 0 && b == null && c == null) &&
                        (y > 0 && z == null)
                    ):
                // Update z with the proper ration
                $('#z').prop('value', function() {
                    return 90 - y;
                });

                // Update b with the calculated value
                $('#b').prop('value', calcOppositeWithAdjacent(y, a));

                // Grab the update 'b' value and update the var
                getSides();

                // Update c with the value since we can now Pythagorum it up
                $('#c').prop('value', calcSideC(a, b));
                break;

            // If we know y & b
            case    (
                        (b > 0 && a == null && c == null) &&
                        (y > 0 && z == null)
                    ):
                // Update z with the proper ration
                $('#z').prop('value', function() {
                    return 90 - y;
                });

                // Update a with the calculated value
                $('#a').prop('value', calcAdjacentWithOpposite(y, b));

                // Grab the update 'a' value
                getSides();

                // Update c with the value since we can now Pythagorum it
                $('#c').prop('value', calcSideC(a, b));
                break;

        // If we know z & a
            case    (
                        (a > 0 && b == null && c == null) &&
                        (z > 0 && y == null)
                    ):
                // Update z with the proper ration
                $('#y').prop('value', function() {
                    return 90 - z;
                });

                // Update a with the calculated value
                $('#b').prop('value', calcAdjacentWithOpposite(z, a));

                // Grab the update 'b' value
                getSides();

                // Update c with the value since we can now Pythagorum it
                $('#c').prop('value', calcSideC(a, b));
                break;

             // If we know z & b
            case    (
                        (b > 0 && a == null && c == null) &&
                        (z > 0 && y == null)
                    ):
                // Update z with the proper ration
                $('#y').prop('value', function() {
                    return 90 - z;
                });

                // Update a with the calculated value
                $('#a').prop('value', calcOppositeWithAdjacent(z, b));

                // Grab the update 'a' value
                getSides();

                // Update c with the value since we can now Pythagorum it
                $('#c').prop('value', calcSideC(a, b));
                break;
        }

        // For calculating tip "d" and shank "e", we need "b". It should
        // be obvious why when looking at the diagram provided on the
        // calc page.
        //
        // Evaluate B & D & E
        getSides();
        getDiameters();

        // If the user has set a tip diameter "d" or shank diameter "e", 
        // make sure "b" is set, and then calculate it out.
        switch(true) {
            case (d > 0 && e == null):
                $('#e').prop('value', ((b*2) + d));
                break;

            case (e > 0 && d == null):
                $('#d').prop('value', (e - (b * 2)));
                break;
        }
    });

    // When the user hits the "Start Over" button, don't actually submit anything,
    // just refresh the page
    $('#trig-clear-form').click(function (event) {
        // Stop the button from actually submitting anything
        event.preventDefault();

        // Reload the page    
        location.reload();
    });
});