$(document).ready(function()
{
    var $login = $('#login');
    $login.submit(function()
    {
        var formArray = $login.serializeArray();
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
                    break;
                case 'pw':
                    if (!formArray[i].value)
                    {
                        submitForm = false;
                        alertStr += 'Password is empty\n';
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
        if (!submitForm)
        {
            alertStr = alertStr.replace(/\n$/, '');
            alert(alertStr);
            return false;
        }
        return true;
    });
});
