/**
 * Checks to make sure that the email is in the correct format, and checks that the password is atleast 8 characters long.
 * @returns true if email is in correct format.
 */


function Validate() {
    var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
    var isValid = regex.test(document.getElementById("Email").value);
    if (!isValid) {
        alert("Enter a valid email address.");
    } else if(document.getElementById("pwd").value.length < 8) {
        alert("Enter a valid password.");
    } else {
        
    }
    return isValid;
}