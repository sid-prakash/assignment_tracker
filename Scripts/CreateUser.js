/**
 * Checks to make sure that the email is in the correct format, and checks that the password is atleast 8 characters long.
 * Also checks if passwords match.
 * @returns true if email is in correct format.
 */



 function Validate() {
    var alpha = (/[a-zA-Z]/)
    var isName = alpha.test(document.getElementById("Name").value);
    var email = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
    var isEmail = email.test(document.getElementById("Email").value);
    if (!isName) {
        alert("Enter Full Name.");
    } else if (!isEmail) {
        alert("Enter a valid email address.");
    } else if(document.getElementById("pwd").value.length < 8) {
        alert("Enter a valid password.");
    } else if(document.getElementById("confPwd").value != document.getElementById("pwd").value) {
        alert("Passwords do not match.");
    } else {
        return true;
    }
    return false;
}

function goBack() {
    window.location.href = "/views/Login.html";
    return false;
}