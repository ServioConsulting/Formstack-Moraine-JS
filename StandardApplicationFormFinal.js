window.FF_OnAfterRender = function() {
    BindClickHandlers();

    // Assuming you have input fields with the ids "Contact.MobilePhone" and "Contact.HomePhone"
    var mobilePhoneInput = fs('#Contact\\.MobilePhone');
    var homePhoneInput = fs('#Contact\\.HomePhone');

    setAttributesAndListeners(mobilePhoneInput);
    setAttributesAndListeners(homePhoneInput);

    // Add event listener for the birth date field
    $("#Contact\\.Birthdate").change(function() {
        Birthdate();
    });

    return true;
}

function Birthdate() {
    // Get the value of the birth date field
    var birthDate = new Date($("#Contact\\.Birthdate").val());
    
    // Calculate the age based on the birth date
    var today = new Date();
    var ageInYears = today.getFullYear() - birthDate.getFullYear();
    var monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        ageInYears--;
    }

    // Display an alert message, disable submit button, and add a message next to the button if the age is under 16
    if (ageInYears < 16) {
        alert("You must be at least 16 years old to apply");
        if ($("#ageError").length === 0) {
            $("<span id='ageError' style='color: red;'>You must be at least 16 years old to apply</span>").insertAfter("#btnnext");
        }
        $("#btnnext").prop("disabled", true);
    } else {
        $("#ageError").remove();
        $("#btnnext").prop("disabled", false);
    }
}

function setAttributesAndListeners(phoneInput) {
    phoneInput.attr('pattern', '^[0-9]{3}-[0-9]{3}-[0-9]{4}$');
    phoneInput.attr('maxlength', '12');

    phoneInput.on('input', function () {
        autoPopulateHyphens(phoneInput);
    });
}

function autoPopulateHyphens(phoneInput) {
    var enteredNumber = phoneInput.val().replace(/-/g, '');

    if (/^\d+$/.test(enteredNumber)) {
        var formattedNumber;
        if (enteredNumber.length <= 6) {
            formattedNumber = enteredNumber.replace(/(\d{3})(\d{3})/, '$1-$2');
        } else {
            formattedNumber = enteredNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }

        phoneInput.val(formattedNumber);
    }
}

function ClearNewRepeatableSection(elem) {
    // Use this selector to only clear visible picklists
    var ignoreHiddenPicklists = 'select[data-ishidden="false"]';
    // Use this selector to clear all picklists, even if they're hidden
    var selectAllPicklists = 'select';
    console.log("Clearing Repeatable Section");
    /* clear out the values from text boxes of newly added section*/
    $(elem).parents('.ff-sec-repeat-wrapper').next().find('input[type="textbox"]').val('');
    $(elem).parents('.ff-sec-repeat-wrapper').next().find('textarea').val('');
    // Replace the variable in the "find()" method if you want to clear all picklists
    var picklists = $(elem).parents('.ff-sec-repeat-wrapper').next().find(ignoreHiddenPicklists);
    picklists.each(function() {
        $(this).val('');
        fs.EH.initFlexControl($(this));
    });
    BindClickHandlers();
    return true;
}

function BindClickHandlers() {
    $('.ff-sec-repeat-wrapper a.ff-add').unbind('click');
    $('.ff-sec-repeat-wrapper a.ff-add').bind('click', function () {
        AddToRepeatableSection(this);
        ClearNewRepeatableSection(this);
    });
    $('.ff-sec-repeat-wrapper a.ff-remove').unbind('click');
    $('.ff-sec-repeat-wrapper a.ff-remove').bind('click', function () {
        RemoveFromRepeatableSection(this);
        BindClickHandlers();
    });
}

// Ensure both functions are called initially
window.FF_OnAfterRender();