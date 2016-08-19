$(document).ready(function()
{
    var $reset = $('#reset');
    $reset.submit(function()
    {
        var formArray = $reset.serializeArray();
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