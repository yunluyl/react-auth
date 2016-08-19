$(document).ready(function()
{
    var $signup = $('#signup');
    var $confirmPassword = $('#confirmPassword');
    $signup.submit(function()
    {
        var formArray = $signup.serializeArray();
        var pw;
        var cpw;
        var submitForm = true;
        var alertStr = '';
        for (var i=0; i<formArray.length; i++)
        {
            switch (formArray[i].name)
            {
                case '_id':
                    if (!formArray[i].value)
                    {
                        submitForm = false;
                        alertStr += 'Email address is empty\n';
                    }
                    else if (!formArray[i].value.match(/^.{1,50}[@].{1,50}[.].{1,50}$/))
                    {
                        submitForm = false;
                        alertStr += 'Email address is not in email format\n';
                    }
                    break;
                case 'dn':
                    if (!formArray[i].value)
                    {
                        submitForm = false;
                        alertStr += 'Display name is empty\n';
                    }
                    break;
                case 'pw':
                    pw = formArray[i].value;
                    if (!formArray[i].value)
                    {
                        submitForm = false;
                        alertStr += 'Password is empty\n';
                    }
                    else if (!formArray[i].value.match(/^[\w~!@#$%^&*()\-+=]{8,20}$/))
                    {
                        submitForm = false;
                        alertStr += 'Password needs to be 8-20 characters, and contains only numbers, letters, and special characters\n';
                    }
                    break;
                case 'cpw':
                    cpw = formArray[i].value;
                    if (!formArray[i].value)
                    {
                        submitForm = false;
                        alertStr += 'Confirm password is empty\n';
                    }
                    break;
                case 'g-recaptcha-response':
                    if (!formArray[i].value)
                    {
                        submitForm = false;
                        alertStr += 'Non-bot verify is not checked\n';
                    }
                    break;
            }
        } 
        if (pw !== cpw)
        {
            submitForm = false;
            alertStr += 'Password and confirm password are not equal\n';
        }
        if (!submitForm)
        {
            alertStr = alertStr.replace(/\n$/, '');
            alert(alertStr);
            return false;
        }
        $confirmPassword.attr('name','');
        return true;
    });
});
